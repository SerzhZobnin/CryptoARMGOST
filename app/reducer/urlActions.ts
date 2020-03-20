import { OrderedMap, OrderedSet, Record } from "immutable";
import { SIGN_DOCUMENTS_FROM_URL, SUCCESS, START, FAIL } from "../constants";

export const ActionModel = Record({
  accessToken: null,
  command: null,
  json: null,
  name: null,
  url: null,
});

export const DefaultReducerState = Record({
  action: null,
  performed: false,
  performing: false,
});

export default (urlAction = new DefaultReducerState(), action) => {
  const { type, payload } = action;
  switch (type) {
    case SIGN_DOCUMENTS_FROM_URL + START:
      return urlAction
        .set("performed", false)
        .set("performing", true);

    case SIGN_DOCUMENTS_FROM_URL + SUCCESS:
      urlAction = urlAction
        .set("performed", true)
        .set("performing", false)
        .set("action", new ActionModel(payload));
      break;

    case SIGN_DOCUMENTS_FROM_URL + FAIL:
      return urlAction
        .set("performed", true)
        .set("performing", false);

  }

  return urlAction;
};
