import * as fs from "fs";
import { OrderedMap, Record } from "immutable";
import {
  ADD_CERTIFICATE_REQUEST_CA,
  CA_CSR_JSON, DELETE_CERTIFICATE_REQUEST_CA, POST_CA_CERTREQUEST, SUCCESS, CA_CERTREGUESTS_JSON,
} from "../constants";
import { mapToArr } from "../utils";

export const CertificateRequestCAModel = Record({
  certRequestId: null,
  certificateReq: null,
  id: null,
  status: null,
});

export const DefaultReducerState = Record({
  entities: OrderedMap({}),
});

export default (certrequests = new DefaultReducerState(), action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_CERTIFICATE_REQUEST_CA:
      certrequests = certrequests
        .setIn(["entities", payload.certificateRequestCA.id], new CertificateRequestCAModel(payload.certificateRequestCA));
      break;

    case POST_CA_CERTREQUEST + SUCCESS:
      certrequests = certrequests
        .setIn(["entities", payload.id, "status"], payload.status)
        .setIn(["entities", payload.id, "certRequestId"], payload.certRequestId);
      break;

    case DELETE_CERTIFICATE_REQUEST_CA:
      certrequests = certrequests
        .deleteIn(["entities", payload.id]);
      break;
  }

  if (type === ADD_CERTIFICATE_REQUEST_CA || type === DELETE_CERTIFICATE_REQUEST_CA ||
      type === POST_CA_CERTREQUEST + SUCCESS) {
    const state = {
      certrequests: mapToArr(certrequests.entities),
    };

    const sstate = JSON.stringify(state, null, 4);

    fs.writeFile(CA_CERTREGUESTS_JSON, sstate, (err: any) => {
      if (err) {
        // tslint:disable-next-line:no-console
        console.log("------- error write to ", CA_CERTREGUESTS_JSON);
      }
    });
  }

  return certrequests;
};
