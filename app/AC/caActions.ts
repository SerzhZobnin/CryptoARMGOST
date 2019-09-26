import {
  FAIL, GET_CA_REGREQUEST,
  POST_CA_REGREQUEST, START, SUCCESS,
} from "../constants";

export async function postApi(url: string, postfields: any) {
  return new Promise((resolve, reject) => {
    const curl = new window.Curl();

    curl.setOpt("URL", url);
    curl.setOpt("FOLLOWLOCATION", true);
    curl.setOpt(window.Curl.option.HTTPHEADER, [
      "Content-Type: application/json",
      "Accept: application/json",
    ]);

    curl.setOpt(window.Curl.option.POSTFIELDS, postfields);

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
        }));

        dispatch({
          payload: {
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
