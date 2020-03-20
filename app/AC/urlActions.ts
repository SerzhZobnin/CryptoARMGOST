import {
  ADD_LICENSE, ADD_REMOTE_FILE, DOWNLOAD_REMOTE_FILE,
  ENCRYPTED, FAIL, PACKAGE_SELECT_FILE, SET_REMOTE_FILES_PARAMS,
  SIGN_DOCUMENTS_FROM_URL, START, SUCCESS,
  TMP_DIR, VERIFY_DOCUMENTS_FROM_URL, VERIFY_SIGNATURE,
} from "../constants";
import { IUnknownAction, URLActionType } from "../parse-app-url";

export function dispatchURLAction(
  action: URLActionType,
) {
  return (dispatch: (action: {}) => void) => {
    switch (action.name) {
      case SIGN_DOCUMENTS_FROM_URL:
        signDocumentsFromURL(action, dispatch);
        break;

      case VERIFY_DOCUMENTS_FROM_URL:
        verifyDocumentsFromURL(action, dispatch);
        break;
    }
  }
}

function signDocumentsFromURL(action: URLActionType, dispatch: (action: {}) => void) {
  dispatch({
    type: SIGN_DOCUMENTS_FROM_URL + START,
  });

  setTimeout(async () => {
    try {
      let data: any;

      const urlObj = new URL(action.url);

      if (action.accessToken) {
        urlObj.searchParams.append("accessToken", action.accessToken);
      }

      if (action.command) {
        urlObj.searchParams.append("command", action.command);
      }

      data = await getJsonFromURL(urlObj.toString());

      if (!data) {
        throw new Error("Error get JSON or json empty");
      }

      dispatch({
        payload: { ...action, json: data },
        type: SIGN_DOCUMENTS_FROM_URL + SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: SIGN_DOCUMENTS_FROM_URL + FAIL,
      });
    }
  }, 0);
  return;
}

function verifyDocumentsFromURL(action: URLActionType, dispatch: (action: {}) => void) {
  setTimeout(async () => {
    let data: any;

    const urlObj = new URL(action.url);

    if (action.accessToken) {
      urlObj.searchParams.append("accessToken", action.accessToken);
    }

    if (action.command) {
      urlObj.searchParams.append("command", action.command);
    }

    data = await getJsonFromURL(urlObj.toString());
  }, 0);
}

function getJsonFromURL(url: string) {
  return new Promise((resolve, reject) => {
    const curl = new window.Curl();

    curl.setOpt("URL", url);
    curl.setOpt("FOLLOWLOCATION", true);
    curl.on("end", (statusCode: number, response: { toString: () => string; }) => {
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
