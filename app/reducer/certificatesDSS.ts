import * as fs from "fs";
import { OrderedMap, Record } from "immutable";
import { CERTIFICATES_DSS_JSON, GET_CERTIFICATES_DSS, START, SUCCESS } from "../constants";
import { arrayToMap, mapToArr } from "../utils";

export const CertificateDSSModel = Record({
  id: null,
  DName: null,
  CertificateBase64: null,
  Status: null,
  IsDefault: null,
  CertificateAuthorityID: null,
  CspID: null,
  HashAlgorithms: null,
  ProviderName: null,
  ProviderType: null,
  PrivateKeyNotBefore: null,
  PrivateKeyNotAfter: null,
  HasPin: null,
  FriendlyName: null,
});

export const DefaultReducerState = Record({
  entities: OrderedMap({}),
});

export default (certificatesDSS = new DefaultReducerState(), action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_CERTIFICATES_DSS + SUCCESS:
      certificatesDSS = certificatesDSS
        .update("entities", (entities) => entities.merge(arrayToMap(payload.certificateMap, CertificateDSSModel)));
      break;
  }

  if (type === GET_CERTIFICATES_DSS + SUCCESS) {
    const state = {
      certificatesDSS: mapToArr(certificatesDSS.entities),
    };

    const sstate = JSON.stringify(state, null, 4);

    fs.writeFile(CERTIFICATES_DSS_JSON, sstate, (err: any) => {
      if (err) {
        // tslint:disable-next-line:no-console
        console.log("------- error write to ", CERTIFICATES_DSS_JSON);
      }
    });
  }

  return certificatesDSS;
};
