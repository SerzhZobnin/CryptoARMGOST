import * as fs from "fs";
import * as path from "path";
import { DSS_ACTIONS, SIGNATURE_TYPE } from "../../constants";

export function buildTransaction(pathDocument: string, certificateId: number,
                                 isDetached: boolean, operationCode: number) {

  const content = fs.readFileSync(pathDocument, "base64");
  const body: ITransaction = {
    Document: content,
    Documents: [],
    OperationCode: operationCode,
    Parameters:
      [
        { Name: "SignatureType", Value: "CMS" },
        { Name: "CertificateID", Value: `${certificateId}` },
        { Name: "DocumentInfo", Value: path.basename(pathDocument) },
        { Name: "DocumentType", Value: path.extname(pathDocument).replace(/\./g, "") },
        { Name: "IsDetached", Value: `${isDetached}` },
        { Name: "CADESType", Value: "BES" },
      ],
  };

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
