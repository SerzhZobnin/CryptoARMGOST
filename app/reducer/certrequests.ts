import * as fs from "fs";
import { OrderedMap, Record } from "immutable";
import {
  ADD_CERTIFICATE_REQUEST_CA,
  CA_CSR_JSON, DELETE_CERTIFICATE_REQUEST_CA, POST_CA_CERTREQUEST, SUCCESS, CA_CERTREGUESTS_JSON, GET_CA_CERTREQUEST, GET_CA_CERTREQUEST_STATUS, POST_CA_CERTREQUEST_СONFIRMATION,
} from "../constants";
import { mapToArr } from "../utils";

export const CertificateRequestCAModel = Record({
  certRequestId: null,
  certificate: null,
  certificateReq: null,
  id: null,
  serviceId: null,
  status: null,
  subject: null,
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
        .setIn(["entities", payload.id, "serviceId"], payload.serviceId)
        .setIn(["entities", payload.id, "status"], payload.status)
        .setIn(["entities", payload.id, "certRequestId"], payload.certRequestId)
        .setIn(["entities", payload.id, "serviceId"], payload.serviceId)
        .setIn(["entities", payload.id, "subject"], payload.subject);
      break;

    case POST_CA_CERTREQUEST_СONFIRMATION + SUCCESS:
      certrequests = certrequests
        .setIn(["entities", payload.id, "status"], payload.status);
      break;

    case GET_CA_CERTREQUEST_STATUS + SUCCESS:
      certrequests = certrequests
        .setIn(["entities", payload.id, "status"], payload.status);
      break;

    case GET_CA_CERTREQUEST + SUCCESS:
      certrequests = certrequests
        .setIn(["entities", payload.id, "certificate"], payload.certificate);
      break;

    case DELETE_CERTIFICATE_REQUEST_CA:
      certrequests = certrequests
        .deleteIn(["entities", payload.id]);
      break;
  }

  if (type === ADD_CERTIFICATE_REQUEST_CA || type === DELETE_CERTIFICATE_REQUEST_CA ||
      type === POST_CA_CERTREQUEST + SUCCESS || type === GET_CA_CERTREQUEST_STATUS + SUCCESS ||
      type === GET_CA_CERTREQUEST + SUCCESS || type === POST_CA_CERTREQUEST_СONFIRMATION + SUCCESS) {
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
