import * as fs from "fs";
import * as path from "path";
import { DSS_ACTIONS, SIGNATURE_TYPE } from "../../constants";

export function buildTransaction(document: string | IDocumentContent[], certificateId: number,
                                 isDetached: boolean, operationCode: number) {

  let body: ITransaction;
  if (typeof document === "string") {
    const content = fs.readFileSync(document, "base64");
    body = {
      Document: content,
      Documents: [],
      OperationCode: operationCode,
      Parameters:
        [
          { Name: "SignatureType", Value: "CMS" },
          { Name: "CertificateID", Value: `${certificateId}` },
          { Name: "DocumentInfo", Value: path.basename(document) },
          { Name: "DocumentType", Value: path.extname(document).replace(/\./g, "") },
          { Name: "IsDetached", Value: `${isDetached}` },
          { Name: "CADESType", Value: "BES" },
        ],
    };
  } else {
    body = {
      Document: "",
      Documents: document,
      OperationCode: operationCode,
      Parameters:
        [
          { Name: "SignatureType", Value: "CMS" },
          { Name: "CertificateID", Value: `${certificateId}` },
          { Name: "IsDetached", Value: `${isDetached}` },
          { Name: "CADESType", Value: "BES" },
        ],
    };
  }

  return body;
}

export function buildDocumentDSS(pathDocument: string, certificateId: number,
                                 isDetached: boolean, cmsSignatureType?: string, pathOriginalDocument?: string) {

  const content = fs.readFileSync(pathDocument, "base64");
  let originalDocument = "";
  if (pathOriginalDocument) { originalDocument = fs.readFileSync(pathOriginalDocument, "base64"); }
  const body: IDocumentDSS = {
    Content: content,
    Name: path.basename(pathDocument),
    Signature: {
      CertificateId: certificateId,
      Parameters: {
        CADESType: "BES",
        CmsSignatureType: cmsSignatureType ? cmsSignatureType : "sign",
        IsDetached: `${isDetached}`,
        OriginalDocument: originalDocument,
      },
      PinCode: "",
      Type: SIGNATURE_TYPE.CMS,
    },
  };

  return body;
}

export function buildDocumentPackageDSS(documents: IDocumentContent[], certificateId: number,
                                        isDetached: boolean, cmsSignatureType?: string) {

  const body: IDocumentPackageDSS = {
    Documents: documents,
    Signature: {
      CertificateId: certificateId,
      Parameters: {
        CADESType: "BES",
        CmsSignatureType: cmsSignatureType ? cmsSignatureType : "Sign", // Cosign
        IsDetached: `${isDetached}`,
      },
      PinCode: "",
      Type: SIGNATURE_TYPE.CMS,
    },
  };

  return body;
}
