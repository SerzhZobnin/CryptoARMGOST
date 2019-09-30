import { ICertificateRequestCA } from "../components/Services/types";
import {
  FAIL, GET_CA_REGREQUEST,
  POST_CA_CERTREQUEST, POST_CA_REGREQUEST, START, SUCCESS, GET_CA_CERTREQUEST, GET_CA_CERTREQUEST_STATUS,
} from "../constants";

export async function postApi(url: string, postfields: any, headerfields: string[]) {
  return new Promise((resolve, reject) => {
    const curl = new window.Curl();

    curl.setOpt("URL", url);
    curl.setOpt("FOLLOWLOCATION", true);
    curl.setOpt(window.Curl.option.HTTPHEADER, headerfields);
    curl.setOpt(window.Curl.option.POSTFIELDS, postfields);

    curl.on("end", function (statusCode: number, response: { toString: () => string; }) {
      let data;

      try {

        if (statusCode !== 200) {
          throw new Error(`Unexpected response, status code ${statusCode}`);
        }

        data = JSON.parse(response.toString());

      } catch (error) {
        reject(`Cannot load data, error: ${error.message}`);
        return;
      } finally {
        curl.close.bind(curl);
      }

      resolve(data);
    });

    curl.on("error", (error: { message: any; }) => {
      curl.close.bind(curl);
      reject(new Error(`Cannot load data by url ${url}, error: ${error.message}`));
    });

    curl.perform();
  });
}

export async function getApi(url: string, headerfields: string[] ) {
  return new Promise((resolve, reject) => {
    const curl = new window.Curl();
    curl.setOpt("URL", url);
    curl.setOpt("FOLLOWLOCATION", true);
    curl.setOpt(window.Curl.option.HTTPHEADER, headerfields);
    curl.on("end", function(statusCode: number, response: { toString: () => string; }) {
      let data;

      try {

        if (statusCode !== 200) {
          throw new Error(`Unexpected response, status code ${statusCode}`);
        }
        data = JSON.parse(response.toString());

      } catch (error) {
        reject(`Cannot load data, error: ${error.message}`);
        return;
      } finally {
        curl.close.bind(curl);
      }

      resolve(data);
    });

    curl.on("error", (error: { message: any; }) => {
      curl.close.bind(curl);
      reject(new Error(`Cannot load data by url ${url}, error: ${error.message}`));
    });

    curl.perform();
  });
}

export function postRegRequest(url: string, comment: string, description: string, email: string, keyPhrase: string, oids: any, serviceId: string) {
  return (dispatch) => {
    dispatch({
      type: POST_CA_REGREQUEST + START,
    });

    setTimeout(async () => {
      let data: any;

      try {
        const OidArray = Object.keys(oids).map(function (key) {
          return { [key]: oids[key] };
        });

        data = await postApi(`${url}/regrequest`, JSON.stringify({
          Comment: comment,
          Description: description,
          Email: email,
          KeyPhrase: keyPhrase,
          OidArray,
        }),
          [
            "Content-Type: application/json",
            "Accept: application/json",
          ]);

        dispatch({
          payload: {
            RDN: oids,
            id: data.RegRequest.RegRequestId,
            regRequest: data.RegRequest,
            serviceId,
          },
          type: POST_CA_REGREQUEST + SUCCESS,
        });
      } catch (e) {
        Materialize.toast(e, 4000, "toast-ca_error");

        dispatch({
          type: POST_CA_REGREQUEST + FAIL,
        });
      }
    }, 0);
  };
}

export function postCertRequest(url: string, certificateRequestCA: ICertificateRequestCA, subject: any, regRequest: any, serviceId: string) {
  return (dispatch) => {
    dispatch({
      type: POST_CA_CERTREQUEST + START,
    });

    setTimeout(async () => {
      let data: any;

      try {
        url = url.substr(0, url.lastIndexOf("/"));
        data = await postApi(
          `${url}/certrequest`,
          certificateRequestCA.certificateReq,
          [
            "Content-Type: application/octet-stream",
            `Authorization: Basic ${Buffer.from(regRequest.Token + ":" + regRequest.Password).toString("base64")}`,
          ],
        );
        dispatch({
          payload: {
            certRequestId: data.CertRequest.CertRequestId,
            id: certificateRequestCA.id,
            serviceId,
            status: data.CertRequest.Status,
            subject,
          },
          type: POST_CA_CERTREQUEST + SUCCESS,
        });
      } catch (e) {
        Materialize.toast(e, 4000, "toast-ca_error");

        dispatch({
          type: POST_CA_CERTREQUEST + FAIL,
        });
      }
    }, 0);
  };
}

export function getCertRequestStatus(url: string, certRequest: ICertificateRequestCA, regRequest: any) {
  return (dispatch) => {
    dispatch({
      type: GET_CA_CERTREQUEST_STATUS + START,
    });

    setTimeout(async () => {
      let data: any;

      try {
        url = url.substr(0, url.lastIndexOf("/"));
        data = await getApi(
          `${url}/certrequest/${certRequest.certRequestId}`,
          [
            `Authorization: Basic ${Buffer.from(regRequest.Token + ":" + regRequest.Password).toString("base64")}`,
          ],
        );
        dispatch({
          payload: {
            id: certRequest.id,
            status: data.CertRequest.Status,
          },
            type: GET_CA_CERTREQUEST_STATUS + SUCCESS,
        });
      } catch (e) {
        Materialize.toast(e, 4000, "toast-ca_error");

        dispatch({
          type: GET_CA_CERTREQUEST_STATUS + FAIL,
        });
      }
    }, 0);
  };
}
