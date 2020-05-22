import {
  FAIL, LOCATION_CERTIFICATES, START, SUCCESS, URL_CMD_CERT_INFO,
} from "../constants";
import localize from "../i18n/localize";
import { IUrlCommandApiV4Type } from "../parse-app-url";
import store from "../store";
import { navigationLock, navigationUnlock } from "./globalLocks";
import { openWindow, paramsRequest, postRequest } from "./urlCmdUtils";

function paramsRequestCerts(id: string) {
  return JSON.stringify(paramsRequest("certificateInfo.parameters", id));
}

function requestCertInfo(id: string, certificate: trusted.pki.Certificate) {
  return JSON.stringify({
    jsonrpc: "2.0",
    method: "certificateInfo.info",
    params: {
      id,
      // tslint:disable-next-line: object-literal-sort-keys
      hash: certificate.hash(),
      issuerFriendlyName: certificate.issuerFriendlyName,
      issuerName: certificate.issuerName,
      notAfter: certificate.notAfter,
      notBefore: certificate.notBefore,
      subjectFriendlyName: certificate.subjectFriendlyName,
      subjectName: certificate.subjectFriendlyName,
      status: trusted.utils.Csp.verifyCertificateChain(certificate),
      serial: certificate.serialNumber,
    },
  });
}

export function handleUrlCommandCertificateInfo( command: IUrlCommandApiV4Type ) {
  postRequest(command.url, paramsRequestCerts(command.id)).then(
    (data: any) => {
      const certValue = Buffer.from(data.result.certificateBase64);
      const cert = new trusted.pki.Certificate();

      try {
        cert.import(certValue, trusted.DataFormat.PEM);
      } catch (e) {
        $(".toast-url-cmd-cert-info-params-fail-err-descr").remove();
        Materialize.toast(localize("UrlCommand.certificate_load_error", window.locale),
          3000, "toast-url-cmd-cert-info-params-fail-err-descr");
        return;
      }

      certInfoStart(cert, data.id, command.url);
      // TODO: display UI with certificate information
      // navigationLock();
      // openWindow(LOCATION_CERTIFICATES, "");

      // TODO: move to UI 'OK' handler
      sendCertificateInfo(cert, command.url, data.id);
    },
    (error) => {
      $(".toast-url-cmd-cert-info-params-fail-err-descr").remove();
      Materialize.toast(error, 3000, "toast-url-cmd-cert-info-params-fail-err-descr");

      // tslint:disable-next-line: no-console
      console.log("Error recieving parameters of certificateInfo command with id " + command.id
        + ". Error description: " + error);
    },
  );
}

export function certInfoStart(cert: trusted.pki.Certificate, id: string, url: string) {
  store.dispatch({
    type: URL_CMD_CERT_INFO + START,
    // tslint:disable-next-line: object-literal-sort-keys
    payload: {
      certToProcess: cert,
      id,
      operation: URL_CMD_CERT_INFO,
      url,
    },
  });
}

export function certInfoSuccess() {
  navigationUnlock();
  store.dispatch({type: URL_CMD_CERT_INFO + SUCCESS});
  $(".toast-url-cmd-cert-info-success").remove();
  Materialize.toast(localize("UrlCommand.cert_info_success", window.locale),
    3000, "toast-url-cmd-cert-info-success");
}

export function certInfoFail() {
  navigationUnlock();
  store.dispatch({type: URL_CMD_CERT_INFO + FAIL});
  $(".toast-url-cmd-cert-info-fail").remove();
  Materialize.toast(localize("UrlCommand.cert_info_fail", window.locale),
    3000, "toast-url-cmd-cert-info-fail");
}

export function sendCertificateInfo(cert: trusted.pki.Certificate, cmdUrl: string, cmdId: string) {
  postRequest(cmdUrl, requestCertInfo(cmdId, cert)).then(
    (data) => {
      certInfoSuccess();
    },
    (error) => {
      certInfoFail();
      // tslint:disable-next-line: no-console
      console.log("Error sending certificate info command with id " + cmdId
        + ". Error description: " + error);
    },
  );
}
