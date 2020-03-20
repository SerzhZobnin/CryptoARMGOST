import { OPERATION_IS_REMOTE } from "../constants";

export function setOperationRemoteStatus(operationIsRemote: boolean) {
  return {
    payload: { operationIsRemote },
    type: OPERATION_IS_REMOTE,
  };
}
