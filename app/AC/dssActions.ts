import * as os from "os";
import {
  FAIL, GET_CERTIFICATES_DSS, GET_POLICY_DSS, POST_AUTHORIZATION_USER_DSS, POST_PERFORM_OPERATION, POST_TRANSACTION_DSS, START, SUCCESS,
} from "../constants";
import { uuid } from "../utils";

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
    curl.setOpt("FOLLOWLOCATION", true);
    curl.setOpt(window.Curl.option.HTTPHEADER, headerfields);
    curl.setOpt(window.Curl.option.POSTFIELDS, postfields);
    curl.on("end", function (statusCode: number, response: any) {
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
};

/**
 * Отправка GET запроса
 * @param url адрес электронного ресурса, на который отправляется GET запрос
 * @param headerfields заголовок GET запроса
 */
export const getApi = async (url: string, headerfields: string[]) => {
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
};

function postAuthorizationUserSuccess(body: any) {
  return {
    payload: {
      access_token: body.AccessToken,
      expires_in: body.ExpiresIn,
      id: uuid(),
    },
    type: POST_AUTHORIZATION_USER_DSS + SUCCESS,
  };
}

function postAuthorizationUserFail(error: string) {
  return {
    payload: {
      error,
    },
    type: POST_AUTHORIZATION_USER_DSS + FAIL,
  };
}

/**
 * Функция формирования и отправки запроса к ЦИ на инициализацию процедуры аутентификации
 * @param url электронный адрес Сервиса Подписи
 * @param login логин пользователя
 * @param password пароль пользователя
 */
export function dssAuthIssue(url: string, login: string, password: string) {
  let headerfield: string[];
  let body: any;
  headerfield = [
    "Content-Type: application/x-www-form-urlencoded",
    `Authorization: Basic ${Buffer.from(login + ":" + password).toString("base64")}`,
  ];
  body = {
    Resource: "urn:cryptopro:dss:signserver:signserver",
  };
  return dssPostMFAUser(url, headerfield, body);
}

/**
 * Функция подтверждения операции (транзакции)
 * @param url электронный адрес Сервиса Подписи
 * @param token маркер доступа
 * @param TransactionTokenId идентификатор транзакции, созданной на Cервисе Подписи
 */
export function dssOperationConfirmation(url: string, token: string, TransactionTokenId: string) {
  let headerfield: string[];
  let body: any;
  headerfield = [
    "Content-Type: application/json; charset=utf-8",
    `Authorization: Bearer ${token}`,
  ];
  body = {
    Resource: "urn:cryptopro:dss:signserver:signserver",
    TransactionTokenId,
  };
  return dssPostMFAUser(url, headerfield, body);
}

/**
 * Функция обычной и двухфакторной аутентификации
 * @param url электронный адрес Сервиса Подписи
 * @param headerfield заголовок запроса, содержащий в себе базовые аутентификационные данные пользователя
 * @param body объект, содержащий идентификатор ресурса и транзакции (при подтверждения операции)
 */
export function dssPostMFAUser(url: string, headerfield: string[], body: any) {
  return async (dispatch) => {
    dispatch({
      type: POST_AUTHORIZATION_USER_DSS + START,
    });

    let data1: any;
    let data2: any;

    try {
      data1 = await postApi(
        `${url}`,
        JSON.stringify(body),
        headerfield,
      );
      if (data1.IsFinal === true) {
        dispatch(postAuthorizationUserSuccess(data1));
      } else {
        const challengeResponse = {
          ChallengeResponse:
          {
            TextChallengeResponse:
              [{
                RefId: `${data1.Challenge.ContextData.RefID}`,
              },
              ],
          },
          Resource: "urn:cryptopro:dss:signserver:signserver",
        };
        const deploy: number = 10000;
        var timeout: number = 0;
        var timerHandle: NodeJS.Timeout | null;
        timerHandle = setTimeout(async function req() {
          timeout += deploy;
          if (timeout >= (data1.Challenge.TextChallenge["0"].ExpiresIn * 1000)) {
            dispatch(postAuthorizationUserFail(`Время ожидания подтверждения истекло`));
            if (timerHandle instanceof NodeJS.Timeout) {
              clearTimeout(timerHandle);
            }
            timerHandle = null;
          }
          data2 = await postApi(
            `${url}`,
            JSON.stringify(challengeResponse),
            headerfield,
          );
          if (data2.IsFinal === true) {
            dispatch(postAuthorizationUserSuccess(data2));
            if (timerHandle instanceof NodeJS.Timeout) {
              clearTimeout(timerHandle);
            }
            timerHandle = null;
          } else if (data2.IsError === true) {
            dispatch(postAuthorizationUserFail(data2.ErrorDescription));
            if (timerHandle instanceof NodeJS.Timeout) {
              clearTimeout(timerHandle);
            }
            timerHandle = null;
          } else { setTimeout(req, deploy); }
        }, deploy);
      }
    } catch (e) {
      dispatch(postAuthorizationUserFail(e));
    }
  };
}

/**
 * Функция обычной аутентификации пользователя
 * @param url электронный адрес Сервиса Подписи
 * @param login логин пользователя
 * @param password пароль пользователя
 */
export function dssPostAuthUser(url: string, login: string, password: string) {
  return async (dispatch) => {
    dispatch({
      type: POST_AUTHORIZATION_USER_DSS + START,
    });

    let data: any;
    let body: string;

    try {
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
        type: POST_AUTHORIZATION_USER_DSS + SUCCESS,
      });
    } catch (e) {
      // Materialize.toast(e, 4000, "toast-ca_error");
      dispatch({
        type: POST_AUTHORIZATION_USER_DSS + FAIL,
      });
    }
  };
}

/**
 * Функция получения сертификатов пользователя Сервиса Подписи
 * @param url электронный адрес Сервиса Подписи
 * @param token маркер доступа
 */
export function getCertificatesDSS(url: string, token: string) {
  return async (dispatch) => {
    dispatch({
      type: GET_CERTIFICATES_DSS + START,
    });

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
        hcertificates.push({ id: certificate.ID, ...certificate });
      }
      dispatch({
        payload: {
          certificateMap: hcertificates,
        },
        type: GET_CERTIFICATES_DSS + SUCCESS,
      });
    } catch (e) {
      dispatch({
        type: GET_CERTIFICATES_DSS + FAIL,
        payload: {
          error: e,
        },
      });
    }
  };
}

/**
 * Функция получения политики Сервиса Подписи
 * @param url электронный адрес Сервиса Подписи
 * @param token маркер доступа
 */
export function getPolicyDSS(url: string, token: string) {
  return async (dispatch) => {
    dispatch({
      type: GET_POLICY_DSS + START,
    });

    let data: any;
    try {
      // https://dss.cryptopro.ru/SignServer/rest
      data = await getApi(
        `${url}/api/policy`,
        [
          `Authorization: Bearer ${token}`,
        ],
      );
      const policy = data.ActionPolicy.filter(function(item: any) {
        return item.Action === "Issue" || item.Action === "SignDocument" || item.Action === "SignDocuments";
      });
      dispatch({
        payload: {
          id: uuid(),
          policy,
        },
        type: GET_POLICY_DSS + SUCCESS,
      });
    } catch (e) {
      dispatch({
        type: GET_POLICY_DSS + FAIL,
        payload: {
          error: e,
        },
      });
    }
  };
}

/**
 * Функция создания транзакции на Сервисе Подписи
 * @param url электронный адрес Сервиса Подписи
 * @param token маркер доступа
 * @param {ITransaction} body объект, содержащий параметры транзакции
 */
export function createTransactionDSS(url: string, token: string, body: ITransaction) {
  return async (dispatch) => {
    dispatch({
      type: POST_TRANSACTION_DSS + START,
    });

    let data: any;
    try {
      // https://dss.cryptopro.ru/STS/oauth
      data = await postApi(
        `${url}/api/transactions`,
        JSON.stringify(body),
        [
          `Authorization: Bearer ${token}`,
          "Content-Type: application/json; charset=utf-8",
        ],
      );
      dispatch({
        payload: {
          id: data,
        },
        type: POST_TRANSACTION_DSS + SUCCESS,
      });
    } catch (e) {
      dispatch({
        type: POST_TRANSACTION_DSS + FAIL,
        payload: {
          error: e,
        },
      });
    }
  };
}

/**
 * Функция выполнения и получения результата операции на Сервисе Подписи
 * @param url электронный адрес Сервиса Подписи
 * @param token маркер доступа
 * @param {IDocumentDSS | IDocumentPackageDSS} body объект, содержащий информацию о документе или пакете документов
 */
export function dssPerformOperation(url: string, token: string, body: IDocumentDSS | IDocumentPackageDSS) {
  return async (dispatch) => {
    dispatch({
      type: POST_PERFORM_OPERATION + START,
    });
    let data: any;
    try {
      data = await postApi(
        `${url}`,
        JSON.stringify(body),
        [
          `Authorization: Bearer ${token}`,
          "Content-Type: application/json; charset=utf-8",
        ],
      );
      dispatch({
        payload: {
          id: data,
        },
        type: POST_PERFORM_OPERATION + SUCCESS,
      });
    } catch (e) {
      dispatch({
        type: POST_PERFORM_OPERATION + FAIL,
        payload: {
          error: e,
        },
      });
    }
  };
}
