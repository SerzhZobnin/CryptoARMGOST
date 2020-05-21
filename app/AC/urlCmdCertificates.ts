import {
  FAIL, LOCATION_CERTIFICATE_SELECTION_FOR_ENCRYPT,
  LOCATION_CERTIFICATE_SELECTION_FOR_SIGNATURE, LOCATION_CERTIFICATES, MY,
  START, SUCCESS, URL_CMD_CERTIFICATES_EXPORT, URL_CMD_CERTIFICATES_IMPORT,
} from "../constants";
import localize from "../i18n/localize";
import { IUrlCommandApiV4Type } from "../parse-app-url";
import store from "../store";
import { navigationLock, navigationUnlock } from "./globalLocks";
import { openWindow, paramsRequest, postRequest, writeCertToTmpFile } from "./urlCmdUtils";

interface ICertResp {
  jsonrpc: string;
  result: ICertificateParameters;
  id: string;
}

interface ICertificateParameters {
  operation: "import"|"export";
  props: ICertificateOperationProps;
}

interface ICertificateOperationPropsExp {
  store?: string[];
  multy: boolean;
}

interface ICertificateOperationPropsImp {
  store?: string[];
  certificateBase64: string;
}

type ICertificateOperationProps =
  | ICertificateOperationPropsExp
  | ICertificateOperationPropsImp;

interface ICertToExport {
  certificateBase64: string;
  friendlyName: string;
}

function paramsRequestCerts(id: string) {
  return JSON.stringify(paramsRequest("certificates.parameters", id));
}

function sendCertReq(id: string, certificate: string, friendlyName: string) {
  return JSON.stringify({
    jsonrpc: "2.0",
    method: "certificates.base64",
    params: {
      id: id,
      certificateBase64: certificate,
      friendlyName: friendlyName
    }
  });
}

function sendCertsReq(id: string, certificates: ICertToExport[]) {
  return JSON.stringify({
    jsonrpc: "2.0",
    method: "certificates.base64",
    params: {
      id: id,
      certificates: certificates
    }
  });
}

export function handleUrlCommandCertificates(
  command: IUrlCommandApiV4Type
) {
  postRequest(command.url, paramsRequestCerts(command.id)).then(
    (data: any) => {
      const operation = data.result.operation;
      const props = data.result.props;
      switch (operation) {
        case "export":
          exportCertificates(props, data.id, command.url);
          break;
        case "import":
          importCertificate(props);
          break;
        default:
          console.log("Error! Unsupported certificates method: " + operation);
          break;
      }
    },
    (error) => {
      console.log("Error recieving parameters of certificate command with id " + command.id
        + ". Error description: " + error.message);
    }
  );
}

function exportCertificates(props: ICertificateOperationPropsExp, id: string, url: string) {
  const stores = (props.store && (props.store.length > 0)) ? props.store : [MY];

  store.dispatch({
    type: URL_CMD_CERTIFICATES_EXPORT + START,
    payload: {
      expProps: props,
      id,
      operation: URL_CMD_CERTIFICATES_EXPORT,
      url,
    },
  });
  navigationLock();

  const targetLocation = props.multy ? LOCATION_CERTIFICATE_SELECTION_FOR_ENCRYPT
    : LOCATION_CERTIFICATE_SELECTION_FOR_SIGNATURE;

  openWindow(targetLocation, stores[0]);
}

function importCertificate(props: ICertificateOperationPropsImp) {
  const certStore = props.store ? props.store : ["MY"];
  const certTmpPath = writeCertToTmpFile(props.certificateBase64);

  store.dispatch({
    type: URL_CMD_CERTIFICATES_IMPORT + START,
    payload: {
      operation: URL_CMD_CERTIFICATES_IMPORT,
      impProps: props,
      certPath: certTmpPath
    },
  });
  navigationLock();

  openWindow(LOCATION_CERTIFICATES, certStore[0]);
}

export function urlCmdCertImportFail() {
  navigationUnlock();
  store.dispatch({type: URL_CMD_CERTIFICATES_IMPORT + FAIL});
  $(".toast-url-cmd-cert-import-fail").remove();
  Materialize.toast(localize("UrlCommand.cert_import_fail", window.locale),
    3000, "toast-url-cmd-cert-import-fail");
}

export function urlCmdCertImportSuccess() {
  navigationUnlock();
  store.dispatch({type: URL_CMD_CERTIFICATES_IMPORT + SUCCESS});
  $(".toast-url-cmd-cert-import-success").remove();
  Materialize.toast(localize("UrlCommand.cert_import_sucess", window.locale),
    3000, "toast-url-cmd-cert-import-success");
}

export function urlCmdSendCert(cert: any, id: string, url: string) {
  const certValue = converCertToPlainBase64(cert);
  postRequest( url, sendCertReq(id, certValue, cert.subjectFriendlyName )).then(
    (data: any) => {
      navigationUnlock();
      store.dispatch({type: URL_CMD_CERTIFICATES_EXPORT + SUCCESS});
      $(".toast-url-cmd-cert-export-success").remove();
      Materialize.toast(localize("UrlCommand.cert_export_sucess", window.locale),
        3000, "toast-url-cmd-cert-export-success");
    },
    (error) => {
      console.log("Error exporting certificate: " + error.message);
      navigationUnlock();
      store.dispatch({type: URL_CMD_CERTIFICATES_EXPORT + FAIL});
      $(".toast-url-cmd-cert-export-fail").remove();
      Materialize.toast(localize("UrlCommand.cert_export_fail", window.locale),
        3000, "toast-url-cmd-cert-export-fail");
    }
  );
}

export function urlCmdSendCerts(certs: any, id: string, url: string) {
  var certificatesToSend = [];
  for (const cert of certs) {
    certificatesToSend.push({
      certificateBase64: converCertToPlainBase64(cert),
      friendlyName: cert.subjectFriendlyName
    });
  }
  postRequest( url, sendCertsReq(id, certificatesToSend )).then(
    (data: any) => {
      navigationUnlock();
      store.dispatch({type: URL_CMD_CERTIFICATES_EXPORT + SUCCESS});
      $(".toast-url-cmd-certs-export-success").remove();
      Materialize.toast(localize("UrlCommand.certs_export_success", window.locale),
        3000, "toast-url-cmd-certs-export-success");
    },
    (error) => {
      console.log("Error exporting certificate: " + error.message);
      navigationUnlock();
      store.dispatch({type: URL_CMD_CERTIFICATES_EXPORT + FAIL});
      $(".toast-url-cmd-certs-export-fail").remove();
      Materialize.toast(localize("UrlCommand.certs_export_fail", window.locale),
        3000, "toast-url-cmd-certs-export-fail");
    }
  );
}

function converCertToPlainBase64(certToConvert: any) {
  const cert: trusted.pki.Certificate = window.PKISTORE.getPkiObject(certToConvert);
  let result: string = cert.export(trusted.DataFormat.PEM).toString();
  result = result.replace("-----BEGIN CERTIFICATE-----", "");
  result = result.replace("-----END CERTIFICATE-----", "");
  result = result.replace(/\r\n|\n|\r/gm, "");

  return result;
}

export function urlCmdCertExportFail() {
  navigationUnlock();
  store.dispatch({type: URL_CMD_CERTIFICATES_EXPORT + FAIL});
  $(".toast-url-cmd-cert-export-fail").remove();
  Materialize.toast(localize("UrlCommand.certs_export_fail", window.locale),
    3000, "toast-url-cmd-cert-export-fail");
}
