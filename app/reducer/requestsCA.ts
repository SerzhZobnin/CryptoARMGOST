import * as fs from "fs";
import { OrderedMap, Record } from "immutable";
import { ADD_CERTIFICATE_REQUEST_CA, ADD_SERVICE, CHANGE_SERVICE_NAME, CHANGE_SERVICE_SETTINGS,
  DELETE_CERTIFICATE_REQUEST_CA, DELETE_SERVICE, SERVICES_JSON } from "../constants";
import { mapToArr } from "../utils";

export const ServiceModel = Record({
  id: null,
  name: null,
  settings: OrderedMap({}),
  type: null,
});

export const CertificateRequestCAModel = Record({
  id: null,
  certificate: null,
});

export const SettingsModel = Record({
  url: null,
});

export const DefaultReducerState = Record({
  entities: OrderedMap({}),
});

export default (requestsCA = new DefaultReducerState(), action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_CERTIFICATE_REQUEST_CA:
      requestsCA = requestsCA.setIn(["entities", payload.certificateRequestCA.id], new CertificateRequestCAModel(payload.certificateRequestCA));
      return requestsCA;

    case DELETE_CERTIFICATE_REQUEST_CA:
      return requestsCA
        .deleteIn(["entities", payload.id]);
  }

  const state = ({
    requestsCA: requestsCA.toJS(),
  });
  state.requestsCA = mapToArr(requestsCA.entities);
  const newSettings = [];

  for (let request of state.requestsCA) {
    newSettings.push(request);
  }

  state.requestsCA = newSettings;

  const sstate = JSON.stringify(state, null, 4);
  fs.writeFile(SERVICES_JSON, sstate, (err: any) => {
    if (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
    }
  });
  return requestsCA;
};
