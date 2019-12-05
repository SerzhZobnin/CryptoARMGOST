import { OrderedMap, Record } from "immutable";
import { DELETE_FILE, PACKAGE_SIGN, START, SUCCESS, VERIFY_SIGNATURE, PACKAGE_DELETE_FILE } from "../constants";
import { arrayToMap } from "../utils";

export interface ITimestamp {
  Accuracy: number;
  Certificates: trusted.pki.CertificateCollection;
  DataHash: Buffer;
  DataHashAlgOID: string;
  HasNonce: boolean;
  Ordering: boolean;
  PolicyID: string;
  SerialNumber: Buffer;
  TSACertificate: trusted.pki.Certificate;
  TSP: trusted.pki.TSP;
  Time: string;
  TsaName: string;
  Type: trusted.cms.StampType;
}

const SignatureModel = Record({
  alg: null,
  certs: [],
  digestAlgorithm: null,
  fileId: null,
  id: null,
  signingTime: null,
  status_verify: null,
  subject: null,
  timestamps: [],
  verifyingTime: null,
});

const DefaultReducerState = Record({
  entities: OrderedMap({}),
  packageSignResult: false,
  signedPackage: false,
  signingPackage: false,
  verifyingPackage: false,
});

export default (signatures = new DefaultReducerState(), action) => {
  const { type, payload } = action;

  switch (type) {
    case PACKAGE_SIGN + START:
      return signatures
        .set("signedPackage", false)
        .set("signingPackage", true)
        .set("packageSignResult", false);

    case PACKAGE_SIGN + SUCCESS:
      return signatures
        .set("signedPackage", true)
        .set("signingPackage", false)
        .set("packageSignResult", payload.packageSignResult);

    case VERIFY_SIGNATURE + SUCCESS:
      return signatures.setIn(["entities", payload.fileId], arrayToMap(payload.signatureInfo, SignatureModel));

    case DELETE_FILE:
      return signatures.deleteIn(["entities", payload.fileId]);

    case PACKAGE_DELETE_FILE:
      payload.filePackage.forEach((id: string) => {
        signatures = signatures.deleteIn(["entities", id]);
      });
      return signatures;
  }

  return signatures;
};
