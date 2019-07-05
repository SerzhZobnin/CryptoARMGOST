import {routerReducer as router} from "react-router-redux";
import {combineReducers} from "redux";
import certificates from "./certificates";
import cloudCSP from "./cloudCSP";
import connections from "./connections";
import containers from "./containers";
import crls from "./crls";
import documents from "./documents";
import events from "./events";
import files from "./files";
import filters from "./filters";
import license from "./license";
import remoteFiles from "./remoteFiles";
import settings from "./settings";
import signatures from "./signatures";

export default combineReducers({
  router,
  certificates,
  cloudCSP,
  connections,
  containers,
  crls,
  documents,
  events,
  files,
  filters,
  license,
  remoteFiles,
  settings,
  signatures,
});
