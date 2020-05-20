import * as fs from "fs";
import { MY, ADDRESS_BOOK, CA, ROOT, TMP_DIR } from "../constants";
import history from "../history";
import localize from "../i18n/localize";

interface IParamsRequest {
  jsonrpc: "2.0";
  method: string;
  id: string;
};

export async function postRequest(url: string, requestData: string|Buffer) {
  return new Promise((resolve, reject) => {
    const curl = new window.Curl();

    const headerfields = [
      "Content-Type: application/json",
      "Content-Length: " + requestData.length,
      "Accept: application/json",
    ];

    curl.setOpt("URL", url);
    curl.setOpt("FOLLOWLOCATION", true);
    curl.setOpt(window.Curl.option.HTTPHEADER, headerfields);
    curl.setOpt(window.Curl.option.POSTFIELDS, requestData);

    curl.on("end", function (statusCode: number, response: any) {
      let data;

      try {

        if (statusCode !== 200) {
          throw new Error(`Unexpected response, status code ${statusCode}`);
        }

        if (!response || (response.toString().length === 0)) {
          data = "";
        } else {
          data = JSON.parse(response.toString());
        }
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

export function paramsRequest(method: string, id: string): IParamsRequest {
  return {
    jsonrpc: "2.0",
    method: method,
    id: id
  };
}

export function openWindow(location: string, certStore: string) {
  const remote = window.electron.remote;
  remote.getCurrentWindow().show();
  remote.getCurrentWindow().focus();

  var resultLocation = location;
  var filter = "my";
  var state = {
    head: localize("Certificate.certs_my", window.locale),
    store: certStore
  };

  if (certStore !== MY) {
    switch(certStore) {
      case ADDRESS_BOOK:
        filter = ADDRESS_BOOK;
        state.head = localize("AddressBook.address_book", window.locale);
        state.store = ADDRESS_BOOK;
        break;

      case CA:
        filter = "intermediate";
        state.head = localize("Certificate.certs_intermediate", window.locale);
        state.store = CA;
        break;

      case ROOT:
        filter = "root";
        state.head = localize("Certificate.certs_root", window.locale);
        state.store = ROOT;
        break;
    }
  }

  history.push({
    pathname: resultLocation,
    search: filter,
    state: state
  });
};

export function writeCertToTmpFile(certBase64: string): string {
  var resultUri = TMP_DIR + "/cert-tmp-" + ((new Date()).getTime()) + ".cer";
  fs.writeFileSync(resultUri, certBase64);

  return resultUri;
}
