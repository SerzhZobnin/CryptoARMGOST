import * as fs from "fs";
import { OrderedMap, Record } from "immutable";
import { CA_REGREGUESTS_JSON, FAIL, GET_CA_REGREQUEST, POST_CA_REGREQUEST, START, SUCCESS, GET_CA_CERTREQUEST } from "../constants";
import { mapToArr } from "../utils";

export const RegRequestModel = Record({
  Comment: null,
  Description: null,
  Email: null,
  KeyPhrase: null,
  Password: null,
  RDN: null,
  RegRequestId: null,
  Status: null,
  Token: null,
  id: null,
  serviceId: null,
  certThumbprint: "",
});

export const DefaultReducerState = Record({
  entities: OrderedMap({}),
});

export default (regrequests = new DefaultReducerState(), action) => {
  const { type, payload } = action;

  switch (type) {
    case POST_CA_REGREQUEST + SUCCESS:
    case GET_CA_REGREQUEST + SUCCESS:
      regrequests = regrequests.setIn(["entities", payload.id], new RegRequestModel({
        id: payload.id,
        ...payload.regRequest,
        RDN: { ...payload.RDN },
        serviceId: payload.service.id,
        Comment: payload.Comment,
        Description: payload.Description,
        Email: payload.Email,
        KeyPhrase: payload.KeyPhrase,
      }));
      break;

    case GET_CA_CERTREQUEST + SUCCESS:
      const { certificate } = payload;

      let certThumbprint = null;

      try {
        const cert = new trusted.pki.Certificate();
        cert.import(new Buffer(certificate), trusted.DataFormat.PEM);

        certThumbprint = `${cert.thumbprint}`;
      } catch (e) {
        //
      }
      const regrequest = regrequests.entities.find((obj: any) => obj.get("serviceId") === payload.serviceId);
      regrequests = regrequests
        .setIn(["entities", regrequest.id, "certThumbprint"], certThumbprint);
      break;
  }

  if (type === POST_CA_REGREQUEST + SUCCESS || type === GET_CA_REGREQUEST + SUCCESS ||
    type === GET_CA_CERTREQUEST + SUCCESS) {
    const state = {
      regrequests: mapToArr(regrequests.entities),
    };

    const sstate = JSON.stringify(state, null, 4);

    fs.writeFile(CA_REGREGUESTS_JSON, sstate, (err: any) => {
      if (err) {
        // tslint:disable-next-line:no-console
        console.log("------- error write to ", CA_REGREGUESTS_JSON);
      }
    });
  }

  return regrequests;
};
