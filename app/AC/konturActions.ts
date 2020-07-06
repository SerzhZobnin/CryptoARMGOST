import * as os from "os";

export interface ISerializedFiles {
  ContentBase64: string;
  FileName: string;
  Id: string;
}

export const KONTUR_CRYPTO_POINT = "https://cloudtest.kontur-ca.ru/v3";
const THUMBPRINT_TEST_CERT = "3d5f36ba9f84d57bee20646ab1f72da384102d18";

/**
 * Отправка POST запроса
 * @param url адрес электронного ресурса, на который отправляется POST запрос
 * @param postfields тело POST запроса
 * @param headerfields заголовок POST запроса
 */
export const postApi = async (url: string, postfields: string, headerfields: string[]) => {
  return new Promise((resolve, reject) => {
    const curl = new window.Curl();
    curl.setOpt("URL", url);
    curl.setOpt ("TIMEOUT", 60);
    curl.setOpt("FOLLOWLOCATION", true);
    curl.setOpt(window.Curl.option.HTTPHEADER, headerfields);

    // TLS auth with test cert
    if (os.type() === "Windows_NT") {
      curl.setOpt(window.Curl.option.SSLCERT, `CurrentUser\\MY\\${THUMBPRINT_TEST_CERT}`);
    } else {
      curl.setOpt(window.Curl.option.SSLCERTTYPE, "CERT_SHA1_HASH_PROP_ID:CERT_SYSTEM_STORE_CURRENT_USER:MY");
      curl.setOpt(window.Curl.option.SSLCERT, `${THUMBPRINT_TEST_CERT}`);
    }

    if (postfields) {
      curl.setOpt(window.Curl.option.POSTFIELDS, postfields);
    }
    curl.on("end", function(statusCode: number, response: any) {
      let data;
      try {

        if (statusCode !== 200) {
          throw new Error(`Неожиданный ответ, код ${statusCode}`);
        }
        data = JSON.parse(response.toString());
      } catch (error) {
        reject(`Ошибка загрузки данных: ${error.message}`);
        return;
      } finally {
        curl.close();
      }
      resolve(data);
    });
    curl.on("error", (error: { message: any; }) => {
      curl.close();
      reject(new Error(`Ошибка загрузки данных по URL ${url}, ошибка: ${error.message}`));
    });
    curl.perform();
  });
};

/**
 * Отправка GET запроса
 * @param url адрес электронного ресурса, на который отправляется GET запрос
 * @param headerfields заголовок GET запроса
 */
export const getApi = async (url: string, headerfields: string[]) => {
  return new Promise((resolve, reject) => {
    const curl = new window.Curl();
    console.log("url", url);
    curl.setOpt("URL", url);
    curl.setOpt("FOLLOWLOCATION", true);
    curl.setOpt(window.Curl.option.HTTPHEADER, headerfields);

    // TLS auth with test cert
    if (os.type() === "Windows_NT") {
      curl.setOpt(window.Curl.option.SSLCERT, `CurrentUser\\MY\\${THUMBPRINT_TEST_CERT}`);
    } else {
      curl.setOpt(window.Curl.option.SSLCERTTYPE, "CERT_SHA1_HASH_PROP_ID:CERT_SYSTEM_STORE_CURRENT_USER:MY");
      curl.setOpt(window.Curl.option.SSLCERT, `${THUMBPRINT_TEST_CERT}`);
    }

    curl.on("end", function (statusCode: number, response: { toString: () => string; }) {
      let data;
      try {
        if (statusCode !== 200) {
          throw new Error(`Неожиданный ответ, код ${statusCode}`);
        }
        data = JSON.parse(response.toString());
      } catch (error) {
        reject(`Ошибка загрузки данных: ${error.message}`);
        return;
      } finally {
        curl.close();
      }
      resolve(data);
    });
    curl.on("error", (error: { message: any; }) => {
      curl.close();
      reject(new Error(`Ошибка загрузки данных по URL ${url}, ошибка: ${error.message}`));
    });
    curl.perform();
  });
};

export function konturPostSign(CertificateBase64: string, SerializedFiles: ISerializedFiles[]) {
  return async (dispatch) => {
    let data: any;
    let body: any;

    try {
      body = {
        CertificateBase64,
        SerializedFiles,
        SignType: 0,
      };

      data = await postApi(
        `${KONTUR_CRYPTO_POINT}/Sign`,
        JSON.stringify(body),
        [
          "Content-Type: application/json; charset=utf-8",
        ],
      );

      if (data) {
        const deploy: number = 10000;
        let timeout: number = 0;
        let timerHandle: NodeJS.Timeout | null;
        let data2;
        let resultBlock;

        await new Promise((resolve, reject) => {
          timerHandle = setInterval(async () => {
            timeout += deploy;

            data2 = await getApi(
              `${KONTUR_CRYPTO_POINT}/GetStatus?operationId=${data.OperationId}`,
              [],
            )
            .catch((error) => {
              console.log("--- error getApi", error);

              if (timerHandle) {
                clearInterval(timerHandle);
                timerHandle = null;
                reject(error);
              }
            });
            if (data2 && data2.FileStatuses && data2.FileStatuses.length) {
              console.log("+++ operation compleated", data2);
              if (timerHandle) {
                clearInterval(timerHandle);
                timerHandle = null;
                // resolve(data2);
              }

              resultBlock = await getApi(
                `${KONTUR_CRYPTO_POINT}/GetResult?resultId=${data2.FileStatuses[0].ResultId}&offset=0&size=${data2.FileStatuses[0].ResultSize}`,
                [],
              )
              .catch((error) => {
                console.log("--- error getApi", error);
              });

              console.log("+++ GetResult compleated ", resultBlock);

            } else {
              console.log("--- operation performing", data2);
            }
          }, 10000);
        });
      }
    } catch (e) {
      console.log("Error", e);

      throw new Error(e);
    }
  };
}
