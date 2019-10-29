import * as os from "os";
import {
  DSS_POST_AUTHORIZATION_USER, FAIL, START, SUCCESS, DSS_GET_CERTIFICATES,
} from "../constants";
import { uuid } from "../utils";

export async function postApi(url: string, postfields: any, headerfields: string[]) {
  return new Promise((resolve, reject) => {
    const curl = new window.Curl();
    curl.setOpt("URL", url);
    curl.setOpt("FOLLOWLOCATION", true);
    curl.setOpt(window.Curl.option.HTTPHEADER, headerfields);
    curl.setOpt(window.Curl.option.POSTFIELDS, postfields);
    curl.on("end", function(statusCode: number, response: any) {
      let data;
      try {

        if (statusCode !== 200) {
          throw new Error(`Unexpected response, status code ${statusCode}`);
        }
        data = JSON.parse(response.toString());
      } catch (error) {
        console.log(response);
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

export async function getApi(url: string, headerfields: string[]) {
  return new Promise((resolve, reject) => {
    const curl = new window.Curl();
    curl.setOpt("URL", url);
    curl.setOpt("FOLLOWLOCATION", true);
    curl.setOpt(window.Curl.option.HTTPHEADER, headerfields);
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

export function dssPostAuthUser(url: string, login: string, password: string) {
  return (dispatch) => {
    dispatch({
      type: DSS_POST_AUTHORIZATION_USER + START,
    });

    setTimeout(async () => {
      let data: any;
      let body: string;

      try {
        // https://dss.cryptopro.ru/STS/oauth

        body = "grant_type=password" + "&client_id=" + encodeURIComponent("cryptoarm") + "&scope=dss" +
          "&username=" + encodeURIComponent(login) + "&password=" + encodeURIComponent(password) +
          "&resource=https://dss.cryptopro.ru/SignServer/rest/api/certificates";
        data = await postApi(
          `${url}/token`,
          body,
          [
            "Content-Type: application/x-www-form-urlencoded",
          ],
        );
        dispatch({
          payload: {
            access_token: data.access_token,
            expires_in: data.expires_in,
            id: uuid(),
            token_type: data.token_type,
          },
          type: DSS_POST_AUTHORIZATION_USER + SUCCESS,
        });
      } catch (e) {
        Materialize.toast(e, 4000, "toast-ca_error");

        dispatch({
          type: DSS_POST_AUTHORIZATION_USER + FAIL,
        });
      }
    }, 0);
  };
}

export function getCertificates(url: string, token: string) {
  return (dispatch) => {
    dispatch({
      type: DSS_GET_CERTIFICATES + START,
    });

    setTimeout(async () => {
      let data: any;
      try {
        // https://dss.cryptopro.ru/SignServer/rest

        data = await getApi(
          `${url}/api/certificates`,
          [
            `Authorization: Bearer ${token}`,
          ],
        );
        const hcertificates: any[] = [];
        for (const certificate of data) {
          hcertificates.push({id: certificate.ID, ...certificate});
        }
        dispatch({
          payload: {
            certificateMap: hcertificates,
          },
          type: DSS_GET_CERTIFICATES + SUCCESS,
        });
      } catch (e) {
        Materialize.toast(e, 4000, "toast-ca_error");

        dispatch({
          type: DSS_GET_CERTIFICATES + FAIL,
        });
      }
    }, 0);
  };
}
