import * as fs from "fs";
import { OrderedMap, Record } from "immutable";
import { CA_REGREGUESTS_JSON, FAIL, GET_CA_REGREQUEST, POST_CA_REGREQUEST, START, SUCCESS, CA_CERTTEMPLATE_JSON } from "../constants";
import { mapToArr } from "../utils";

export const CertTemplateModel = Record({
  id: null,
  serviceId: null,
  template: null,
});

export const DefaultReducerState = Record({
  entities: OrderedMap({}),
});

export default (certtemplate = new DefaultReducerState(), action) => {
  const { type, payload } = action;

  switch (type) {
    case POST_CA_REGREQUEST + SUCCESS:
    case GET_CA_REGREQUEST + SUCCESS:
      certtemplate = certtemplate.setIn(["entities", payload.id], new CertTemplateModel({
        id: payload.id,
        serviceId: payload.serviceId,
        template: payload.template,
      }));
      break;
  }

  if (type === POST_CA_REGREQUEST + SUCCESS || type === GET_CA_REGREQUEST + SUCCESS) {
    const state = {
      certtemplate: mapToArr(certtemplate.entities),
    };

    const sstate = JSON.stringify(state, null, 4);

    fs.writeFile(CA_CERTTEMPLATE_JSON, sstate, (err: any) => {
      if (err) {
        // tslint:disable-next-line:no-console
        console.log("------- error write to ", CA_CERTTEMPLATE_JSON);
      }
    });
  }

  return certtemplate;
};
