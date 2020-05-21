import { Record } from "immutable";
import {
  GLOBAL_LOCKS_NAVIGATION_LOCK, GLOBAL_LOCKS_NAVIGATION_UNLOCK,
} from "../constants";

export const DefaultReducerState = Record({
  lockNavigation: false,
  // isLockedForOperation: false,
  // currentOpration: "",
});

export default (globalLocks = new DefaultReducerState(), action) => {
  const { type, payload } = action;
  switch (type) {
    case GLOBAL_LOCKS_NAVIGATION_LOCK:
      globalLocks = DefaultReducerState()
         .set("lockNavigation", true);
      break;

    case GLOBAL_LOCKS_NAVIGATION_UNLOCK:
      globalLocks = DefaultReducerState()
          .set("lockNavigation", false);
      break;

    default:
      break;
  }

  return globalLocks;
};
