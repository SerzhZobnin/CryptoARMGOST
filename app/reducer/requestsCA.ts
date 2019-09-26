import * as fs from "fs";
import { OrderedMap, Record } from "immutable";
import {
  ADD_CERTIFICATE_REQUEST_CA,
  CA_CSR_JSON, DELETE_CERTIFICATE_REQUEST_CA,
} from "../constants";
import { mapToArr } from "../utils";

export const CertificateRequestCAModel = Record({
  certificate: null,
  id: null,
});

export const DefaultReducerState = Record({
  entities: OrderedMap({}),
});

export default (requestsCA = new DefaultReducerState(), action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_CERTIFICATE_REQUEST_CA:
      requestsCA = requestsCA.setIn(["entities", payload.certificateRequestCA.id], new CertificateRequestCAModel(payload.certificateRequestCA));
      break;

    case DELETE_CERTIFICATE_REQUEST_CA:
      requestsCA = requestsCA
        .deleteIn(["entities", payload.id]);
      break;
  }

  if (type === ADD_CERTIFICATE_REQUEST_CA || type === DELETE_CERTIFICATE_REQUEST_CA) {
    const state = {
      requestsCA: mapToArr(requestsCA.entities),
    };

    const sstate = JSON.stringify(state, null, 4);

    fs.writeFile(CA_CSR_JSON, sstate, (err: any) => {
      if (err) {
        // tslint:disable-next-line:no-console
        console.log("------- error write to ", CA_CSR_JSON);
      }
    });
  }

  return requestsCA;
};
