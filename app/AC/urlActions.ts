import * as fs from "fs";
import * as path from "path";
import {
  ADD_LICENSE, ADD_REMOTE_FILE, DOWNLOAD_REMOTE_FILE,
  ENCRYPTED, FAIL, PACKAGE_SELECT_FILE, REMOVE_URL_ACTION,
  SET_REMOTE_FILES_PARAMS, SIGN_DOCUMENTS_FROM_URL, START,
  SUCCESS, TMP_DIR, VERIFY_DOCUMENTS_FROM_URL, VERIFY_SIGNATURE,
} from "../constants";
import { IUnknownAction, URLActionType } from "../parse-app-url";
import store from "../store";
import * as signs from "../trusted/sign";
import { extFile, fileExists, md5 } from "../utils";

export function dispatchURLAction(
  action: URLActionType,
) {
  switch (action.name) {
    case SIGN_DOCUMENTS_FROM_URL:
      signDocumentsFromURL(action);
      break;

    case VERIFY_DOCUMENTS_FROM_URL:
      verifyDocumentsFromURL(action);
      break;
  }
}

export function removeUrlAction() {
  store.dispatch({
    type: REMOVE_URL_ACTION,
  });
}

function signDocumentsFromURL(action: URLActionType) {
  store.dispatch({
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

      if (data && data.params && data.params.files) {
        const { extra, files } = data.params;

        store.dispatch({
          payload: {
            method: data.method,
            token: data.params.token,
            uploader: data.params.uploader,
          },
          type: SET_REMOTE_FILES_PARAMS,
        });

        for (const file of files) {
          if (file.name) {
            let pathForSave = path.join(TMP_DIR, file.name);

            store.dispatch({ type: ADD_REMOTE_FILE, payload: { id: file.id, file: { ...file } } });

            let indexFile: number = 1;
            let newOutUri: string = pathForSave;
            while (fileExists(newOutUri)) {
              const parsed = path.parse(pathForSave);

              newOutUri = path.join(parsed.dir, parsed.name + "_(" + indexFile + ")" + parsed.ext);
              indexFile++;
            }

            pathForSave = newOutUri;

            const fileUrl = new URL(file.url);

            if (extra.token) {
              fileUrl.searchParams.append("accessToken", extra.token);
            }

            store.dispatch({ type: DOWNLOAD_REMOTE_FILE + START, payload: { id: file.id } });

            await dowloadFile(fileUrl.toString(), pathForSave);

            store.dispatch({ type: DOWNLOAD_REMOTE_FILE + SUCCESS, payload: { id: file.id } });

            store.dispatch({
              type: PACKAGE_SELECT_FILE + START,
            });

            const fileProps = getFileProperty(pathForSave);

            const fileId = fileProps.id;

            setTimeout(() => {
              if (fileProps.filename.split(".").pop() === "sig") {
                let signaruteStatus = false;
                let signatureInfo;
                let cms: trusted.cms.SignedData;

                try {
                  cms = signs.loadSign(fileProps.fullpath);

                  if (cms.isDetached()) {
                    if (!(cms = signs.setDetachedContent(cms, fileProps.fullpath))) {
                      throw new Error(("err"));
                    }
                  }

                  signaruteStatus = signs.verifySign(cms);
                  signatureInfo = signs.getSignPropertys(cms);

                  signatureInfo = signatureInfo.map((info) => {
                    return {
                      fileId,
                      ...info,
                      id: Math.random(),
                      verifyingTime: new Date().getTime(),
                    };
                  });

                } catch (error) {
                  store.dispatch({
                    payload: { error, fileId },
                    type: VERIFY_SIGNATURE + FAIL,
                  });
                }

                if (signatureInfo) {
                  store.dispatch({
                    payload: { fileId, signaruteStatus, signatureInfo },
                    type: VERIFY_SIGNATURE + SUCCESS,
                  });
                }
              }

              store.dispatch({
                payload: {
                  filePackage: [{
                    ...fileProps,
                    active: true,
                    extra,
                    id: fileId,
                    remoteId: file.id,
                  }],
                },
                type: PACKAGE_SELECT_FILE + SUCCESS,
              });
            }, 0);
          }
        }
      }

      store.dispatch({
        payload: { ...action, json: data },
        type: SIGN_DOCUMENTS_FROM_URL + SUCCESS,
      });
    } catch (error) {
      store.dispatch({
        type: SIGN_DOCUMENTS_FROM_URL + FAIL,
      });
    }
  }, 0);
  return;
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
        curl.close();
      }

      resolve(data);
    });

    curl.on("error", (error: { message: any; }) => {
      curl.close();
      reject(new Error(`Cannot load data by url ${url}, error: ${error.message}`));
    });

    curl.perform();
  });
}

function dowloadFile(url: string, fileOutPath: string) {
  return new Promise((resolve, reject) => {
    try {
      const curl = new window.Curl();
      // tslint:disable-next-line:no-bitwise
      curl.enable(window.CurlFeature.Raw | window.CurlFeature.NoStorage);

      if (fs.existsSync(fileOutPath)) {
        reject(new Error(`File exists ${fileOutPath}`));
      }

      curl.setOpt("URL", url);
      curl.setOpt(window.Curl.option.WRITEFUNCTION, chunk => {
        fs.appendFileSync(fileOutPath, chunk);

        return chunk.length;
      });

      curl.on("end", (statusCode: number, response: { toString: () => string; }, headers: any) => {
        try {
          if (statusCode !== 200) {
            throw new Error(`Unexpected response, status code ${statusCode}`);
          }
        } catch (error) {
          reject(`Cannot load data, error: ${error.message}`);
          return;
        } finally {
          curl.close();
        }

        resolve();
      });

      curl.on("error", (error: { message: any; }) => {
        curl.close();
        reject(new Error(`Cannot load data by url ${url}, error: ${error.message}`));
      });

      curl.perform();
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log("--- Error dowloadFile", e);
      reject();
    }
  });
}

const getFileProperty = (filepath: string) => {
  const stat = fs.statSync(filepath);

  const extension = extFile(filepath);

  return {
    extension,
    id: md5(filepath),
    filename: path.basename(filepath),
    filesize: stat.size,
    fullpath: filepath,
    mtime: stat.birthtime,
    size: stat.size,
  };
};
