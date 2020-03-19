import { SIGN_DOCUMENTS_FROM_URL, VERIFY_DOCUMENTS_FROM_URL } from "../constants";
import { IUnknownAction, URLActionType } from "../parse-app-url";
import logger from "../winstonLogger";

export function dispatchURLAction(
  action: URLActionType,
) {
  console.log("---- action", action);

  switch (action.name) {
    case SIGN_DOCUMENTS_FROM_URL:
      signDocumentsFromURL(action);
      break;

    case VERIFY_DOCUMENTS_FROM_URL:
      verifyDocumentsFromURL(action);
      break;

    default:
      const unknownAction: IUnknownAction = action;
      logger.warn(
        `Unknown URL action: ${
        unknownAction.name
        } - payload: ${JSON.stringify(unknownAction)}`,
      );
  }
}

function signDocumentsFromURL(action: URLActionType) {
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

    console.log("--- data sign", data);

    try {
      console.log("--- data string", data.toString());
      console.log("--- data string", JSON.parse(data.toString()));
    } catch (error) {
      console.log("error", error);
    }
  }, 0);
}

function verifyDocumentsFromURL(action: URLActionType) {
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

    console.log("--- data verify", data);
  }, 0);
}

function getJsonFromURL(url: string) {
  return new Promise((resolve, reject) => {
    const curl = new window.Curl();
    let data = new Buffer("");

    curl.setOpt("URL", url);
    curl.setOpt("FOLLOWLOCATION", true);
    curl.on("end", function (statusCode: number, response: { toString: () => string; }) {
      try {
        if (statusCode !== 200) {
          throw new Error(`Unexpected response, status code ${statusCode}`);
        }
      } catch (error) {
        reject(`Cannot load data, error: ${error.message}`);
        return;
      } finally {
        curl.close.bind(curl);
      }

      resolve(data);
    });

    curl.on("data", (chunk: Buffer) => {
      data = Buffer.concat([data, chunk]);
      return chunk.length;
    });

    curl.on("error", (error: { message: any; }) => {
      curl.close.bind(curl);
      reject(new Error(`Cannot load data by url ${url}, error: ${error.message}`));
    });

    curl.perform();
  });
}
