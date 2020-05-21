import {
  GLOBAL_LOCKS_NAVIGATION_LOCK, GLOBAL_LOCKS_NAVIGATION_UNLOCK,
} from "../constants";
import store from "../store";

export function navigationLock() {
  store.dispatch({type: GLOBAL_LOCKS_NAVIGATION_LOCK});
}

export function navigationUnlock() {
  store.dispatch({type: GLOBAL_LOCKS_NAVIGATION_UNLOCK});
}
