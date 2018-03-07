import { Map, OrderedMap, Record } from "immutable";
import { filePackageDelete } from "../AC/index";
import { ADD_REMOTE_FILE, DOWNLOAD_REMOTE_FILE, REMOVE_ALL_REMOTE_FILES, SET_REMOTE_FILES_PARAMS, START, SUCCESS, UPLOAD_FILE } from "../constants";
import { arrayToMap } from "../utils";

export interface IRemoteFile {
  extra: any;
  id: number;
  loaded: boolean;
  loading: boolean;
  name: string;
  socketId: string;
  url: string;
}

const FileModel = Record({
  extra: null,
  id: null,
  loaded: false,
  loading: false,
  name: null,
  socketId: null,
  url: null,
});

const DefaultReducerState = Record({
  entities: OrderedMap({}),
  method: null,
  token: null,
  uploader: null,
});

export default (files = new DefaultReducerState(), action) => {
  const { type, payload, randomId } = action;

  switch (type) {
    case ADD_REMOTE_FILE:
      return files.setIn(["entities", payload.id], new FileModel({
        id: payload.id,
        ...payload.file,
      }));

    case SET_REMOTE_FILES_PARAMS:
      return files
        .set("method", payload.method)
        .set("token", payload.token)
        .set("uploader", payload.uploader);

    case DOWNLOAD_REMOTE_FILE + START:
      return files.setIn(["entities", payload.id, "loading"], true);

    case DOWNLOAD_REMOTE_FILE + SUCCESS:
      return files
        .setIn(["entities", payload.id, "loading"], false)
        .setIn(["entities", payload.id, "loaded"], true);

    case REMOVE_ALL_REMOTE_FILES:
      return files = new DefaultReducerState();
  }

  return files;
};