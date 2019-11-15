import * as fs from "fs";
import * as path from "path";
import { DSS_ACTIONS, SIGNATURE_TYPE } from "../../constants";

/**
 * Вспомогательная функция создания объекта ITransaction для операции создания транзакции
 * @param {tring | IDocumentContent[]} document путь до файла или массив объектов, содержащих информацию о документах
 * @param certificateId идентификатор сертификата подписи на Сервисе Подписи
 * @param isDetached флаг, определяющий отделённую/присоединённую подпись
 * @param operationCode код операции на Сервисе Подписи
 */
export function buildTransaction(document: string | IDocumentContent[], certificateId: string,
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

/**
 * Вспомогательная функция создания объекта IDocumentDSS для операции подписи документов
 * @param pathDocument путь до файла
 * @param certificateId идентификатор сертификата подписи на Сервисе Подписи
 * @param isDetached флаг, определяющий отделённую/присоединённую подпись
 * @param cmsSignatureType тип подписи (sign, cosign)
 * @param pathOriginalDocument путь до исходного файла (необходимо для соподписи)
 */
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

/**
 * Вспомогательная функция создания объекта IDocumentPackageDSS для операции подписи пакета документов
 * @param documents массив объектов, содержащих информацию о документах
 * @param certificateId идентификатор сертификата подписи на Сервисе Подписи
 * @param isDetached флаг, определяющий отделённую/присоединённую подпись
 * @param cmsSignatureType тип подписи (Sign, Сosign)
 */
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
