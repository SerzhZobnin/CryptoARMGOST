import * as fs from "fs";
import * as path from "path";
import { push } from "react-router-redux";
import {
  LOCATION_MAIN, REMOVE_ALL_FILES, REMOVE_ALL_REMOTE_FILES, SELECT_FILE,
} from "../../constants";
import { DECRYPT, ENCRYPT, SIGN, VERIFY } from "../../constants";
import store from "../../store/index";
import { extFile, fileExists, md5 } from "../../utils";

const remote = window.electron.remote;
const ipcRenderer = window.electron.ipcRenderer;

ipcRenderer.on("cmdArgs", (event, cmdArgs) => {
  if (cmdArgs && Array.isArray(cmdArgs) && cmdArgs.length >= 2) {
    const openFilePath = cmdArgs[1];

    openFile(openFilePath);
  }
});

const openFile = (openFilePath: string) => {
  if (openFilePath && fileExists(openFilePath)) {
    cleanFileLists();

    const file = getFileProperty(openFilePath);

    store.dispatch({
      payload: {
        file,
      },
      type: SELECT_FILE,
    });

    if (file.extension === "enc") {
      openWindow(ENCRYPT);
    } else {
      openWindow(SIGN);
    }
  }
};

const cleanFileLists = () => {
  store.dispatch({ type: REMOVE_ALL_FILES });
  store.dispatch({ type: REMOVE_ALL_REMOTE_FILES });
};

const getFileProperty = (filepath: string) => {
  const stat = fs.statSync(filepath);

  const extension = extFile(filepath);

  return {
    extension,
    id: md5(filepath),
    filename: path.basename(filepath),
    filesize: stat.size,
    fullpath: filepath,
    mtime: stat.birthtime,
    size: stat.size,
  };
};

const openWindow = (operation: string) => {
  remote.getCurrentWindow().show();
  remote.getCurrentWindow().focus();

  switch (operation) {
    case SIGN:
    case VERIFY:
      store.dispatch(push(LOCATION_MAIN));
      return;

    case ENCRYPT:
    case DECRYPT:
      store.dispatch(push(LOCATION_MAIN));
      return;

    default:
      return;
  }
};
