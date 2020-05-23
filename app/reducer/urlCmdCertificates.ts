import * as fs from "fs";
import { Record } from "immutable";
import {
  FAIL, INTERRUPT, START, SUCCESS,
  URL_CMD_CERTIFICATES_EXPORT,
  URL_CMD_CERTIFICATES_IMPORT,
} from "../constants";
import { fileExists } from "../utils";

export const DefaultReducerState = Record({
  certPath: "",
  done: false,
  expProps: null,
  id: "",
  impProps: null,
  operation: "",
  result: false,
  url: "",
});

export default (urlCmdCerts = new DefaultReducerState(), action: any) => {
  const { type, payload } = action;
  switch (type) {
    case URL_CMD_CERTIFICATES_IMPORT + START:
      urlCmdCerts = DefaultReducerState()
         .set("operation", payload.operation)
         .set("impProps", payload.impProps)
         .set("certPath", payload.certPath);
      break;

    case URL_CMD_CERTIFICATES_IMPORT + INTERRUPT:
    case URL_CMD_CERTIFICATES_IMPORT + FAIL:
      cleanTmpCertFile(urlCmdCerts);
      urlCmdCerts = urlCmdCerts
        .set("done", true)
        .set("result", false)
        .set("impProps", null)
        .set("certPath", "");
      break;

    case URL_CMD_CERTIFICATES_IMPORT + SUCCESS:
      cleanTmpCertFile(urlCmdCerts);
      urlCmdCerts = urlCmdCerts
        .set("done", true)
        .set("result", true)
        .set("impProps", null)
        .set("certPath", "");
      break;

    case URL_CMD_CERTIFICATES_EXPORT + START:
      urlCmdCerts = DefaultReducerState()
        .set("operation", payload.operation)
        .set("expProps", payload.expProps)
        .set("id", payload.id)
        .set("url", payload.url);
      break;

    case URL_CMD_CERTIFICATES_EXPORT + INTERRUPT:
    case URL_CMD_CERTIFICATES_EXPORT + FAIL:
      urlCmdCerts = urlCmdCerts
        .set("done", true)
        .set("result", false)
        .set("expProps", null)
        .set("id", "")
        .set("url", "");
      break;

    case URL_CMD_CERTIFICATES_EXPORT + SUCCESS:
      urlCmdCerts = urlCmdCerts
        .set("done", true)
        .set("result", true)
        .set("expProps", null)
        .set("id", "")
        .set("url", "");
      break;

    default:
      break;
  }

  return urlCmdCerts;
};

function cleanTmpCertFile(reducerState: any) {
  const filePathToClean = reducerState.get("certPath");
  if (filePathToClean && fileExists(filePathToClean)) {
    fs.unlink(filePathToClean, (err) => {/**/});
  }
}
