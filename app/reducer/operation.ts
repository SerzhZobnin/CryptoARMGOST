import { Record } from "immutable";
import {
  OPERATION_IS_REMOTE,
} from "../constants";

const DefaultReducerState = Record({
  operationIsRemote: false,
});

export default (operation = new DefaultReducerState(), action) => {
  const { type, payload } = action;

  switch (type) {
    case OPERATION_IS_REMOTE:
      return Object.assign({}, operation, {
        operationIsRemote: payload.operationIsRemote
      });

    default:
      return operation;
  }

  return operation;
};
