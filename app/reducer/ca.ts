import { OrderedMap, Record } from "immutable";
import { FAIL, POST_CA_REGREQUEST, START, SUCCESS } from "../constants";

export const RegRequestModel = Record({
  Password: null,
  RegRequestId: null,
  Status: null,
  Token: null,
  id: null,
  serviceId: null,
});

export const DefaultReducerState = Record({
  regRequests: OrderedMap({}),
});

export default (caServices = new DefaultReducerState(), action) => {
  const { type, payload } = action;

  switch (type) {
    case POST_CA_REGREQUEST + SUCCESS:
      return caServices.setIn(["regRequests", payload.id], new RegRequestModel({
        id: payload.id,
        ...payload.regRequest,
        serviceId: payload.serviceId,
      }));
  }

  return caServices;
};
