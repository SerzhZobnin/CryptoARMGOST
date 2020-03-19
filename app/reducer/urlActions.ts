import { OrderedMap, OrderedSet, Record } from "immutable";
import { SIGN_DOCUMENTS_FROM_URL, SUCCESS } from "../constants";

export const ActionModel = Record({
  accessToken: null,
  command: null,
  json: null,
  name: null,
  url: null,
});

export const DefaultReducerState = Record({
  entities: OrderedMap({}),
});

export default (urlActions = new DefaultReducerState(), action) => {
  const { type, payload } = action;
  switch (type) {
    case SIGN_DOCUMENTS_FROM_URL + SUCCESS:
      urlActions = urlActions
        .setIn(["entities", payload.id], new ActionModel(payload));
      break;
  }

  return urlActions;
};
