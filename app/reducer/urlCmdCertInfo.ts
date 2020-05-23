import { Record } from "immutable";
import {
  FAIL, START, SUCCESS, URL_CMD_CERT_INFO,
} from "../constants";

export interface IUrlCmdCertInfo {
  certToProcess: trusted.pki.Certificate;
  certToProcessPkiItemInfo: any;
  done: boolean;
  id: string;
  pkiItem: any;
  url: string;
}

export const DefaultReducerState = Record({
  certToProcess: null,
  certToProcessPkiItemInfo: null,
  done: true,
  id: "",
  pkiItem: null,
  url: "",
});

export default (urlCmdCertInfo = new DefaultReducerState(), action: any) => {
  const { type, payload } = action;
  switch (type) {
    case URL_CMD_CERT_INFO + START:
      if (!urlCmdCertInfo) {
        urlCmdCertInfo = DefaultReducerState();
      }
      urlCmdCertInfo = DefaultReducerState()
        .set("done", false)
        .set("id", payload.id)
        .set("url", payload.url)
        .set("certToProcess", payload.certToProcess)
        .set("certToProcessPkiItemInfo", payload.certToProcessPkiItemInfo);
      break;

    case URL_CMD_CERT_INFO + SUCCESS:
    case URL_CMD_CERT_INFO + FAIL:
      urlCmdCertInfo = DefaultReducerState();
      break;

    default:
      break;
  }

  return urlCmdCertInfo;
};
