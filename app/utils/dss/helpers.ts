import * as fs from "fs";
import * as path from "path";
import { SIGNATURE_TYPE } from "../../constants";

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
