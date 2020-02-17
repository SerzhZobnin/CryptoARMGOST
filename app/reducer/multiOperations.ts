import { Map, OrderedMap, Record } from "immutable";
import {
  FAIL, MULTI_DIRECT_OPERATION, START, SUCCESS, VERIFY_LICENSE,
} from "../constants";

const DefaultReducerState = Record({
  files: OrderedMap({}),
  performed: false,
  performing: false,
  status: false,
});

export default (lastOperationResults = new DefaultReducerState(), action) => {
  const { type, payload } = action;

  switch (type) {
    case MULTI_DIRECT_OPERATION + START:
      return lastOperationResults
        .set("performing", true)
        .set("performed", false);

    case MULTI_DIRECT_OPERATION + SUCCESS:
      return lastOperationResults
        .set("performing", false)
        .set("performed", true)
        .set("status", payload.status)
        .set("files", OrderedMap(payload.directResult.files) );

    case MULTI_DIRECT_OPERATION + FAIL:
      return lastOperationResults
        .set("performing", false)
        .set("performed", false)
        .set("status", false);
  }

  return lastOperationResults;
};
