import * as fs from "fs";
import { OrderedMap, Record } from "immutable";
import { DSS_CERTIFICATES_JSON, DSS_GET_CERTIFICATES, START, SUCCESS, GET_POLICY_DSS, POLICY_DSS_JSON, } from "../constants";
import { arrayToMap, mapToArr } from "../utils";

export const PolicyDSSModel = Record({
  id: null,
  policy: null,
});

export const DefaultReducerState = Record({
  entities: OrderedMap({}),
});

export default (policyDSS = new DefaultReducerState(), action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_POLICY_DSS + SUCCESS:
      policyDSS = policyDSS
        .setIn(["entities", payload.id], new PolicyDSSModel(payload));
      break;
  }

  if (type === GET_POLICY_DSS + SUCCESS) {
    const state = {
      policyDSS: mapToArr(policyDSS.entities),
    };

    const sstate = JSON.stringify(state, null, 4);

    fs.writeFile(POLICY_DSS_JSON, sstate, (err: any) => {
      if (err) {
        // tslint:disable-next-line:no-console
        console.log("------- error write to ", POLICY_DSS_JSON);
      }
    });
  }

  return policyDSS;
};
