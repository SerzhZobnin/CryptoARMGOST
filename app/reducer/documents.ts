import * as fs from "fs";
import { OrderedMap, OrderedSet, Record } from "immutable";
import {
  ADD_DOCUMENTS, ARHIVE_DOCUMENTS, LOAD_ALL_DOCUMENTS, PACKAGE_DELETE_DOCUMENTS,
  PACKAGE_SELECT_DOCUMENT, REMOVE_ALL_DOCUMENTS,
  REMOVE_DOCUMENTS, SELECT_ALL_DOCUMENTS, SELECT_DOCUMENT, START, SUCCESS, UNSELECT_ALL_DOCUMENTS, UNSELECT_DOCUMENT,
} from "../constants";
import { arrayToMap, fileExists } from "../utils";

const DocumentModel = Record({
  atime: null,
  birthtime: null,
  extension: null,
  filename: null,
  filesize: null,
  fullpath: null,
  id: null,
  mtime: null,
  selected: null,
});

const DefaultReducerState = Record({
  entities: OrderedMap({}),
  loaded: false,
  loading: false,
  selected: new OrderedSet([]),
});

export default (documents = new DefaultReducerState(), action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_ALL_DOCUMENTS + START:
    case ADD_DOCUMENTS + START:
      return documents.set("loading", true);

    case LOAD_ALL_DOCUMENTS + SUCCESS:
      return documents
        .set("entities", arrayToMap(payload.documents, DocumentModel))
        .set("loading", false)
        .set("loaded", true)
        .set("selected", new OrderedSet([]));

    case ADD_DOCUMENTS + SUCCESS:
      documents = documents
        .update("entities", (entities) => arrayToMap(payload.documents, DocumentModel).merge(entities))
        .set("loading", false)
        .set("loaded", true);

      for (const doc of payload.documents) {
        documents = documents.update("selected", (selected) => selected.has(doc.id)
          ? selected.remove(doc.id)
          : selected.add(doc.id));
      }

      return documents;

    case REMOVE_ALL_DOCUMENTS:
      return documents = new DefaultReducerState();

    case REMOVE_DOCUMENTS:
      return documents = new DefaultReducerState();

    case ARHIVE_DOCUMENTS:
      return documents = new DefaultReducerState();

    case SELECT_DOCUMENT:
      return documents.update("selected", (selected) => selected.has(payload.uid)
        ? selected.remove(payload.uid)
        : selected.add(payload.uid),
      );

    case PACKAGE_SELECT_DOCUMENT:
      const allSelectDocumentsId: number[] = [];

      documents.entities.map((item: any) => allSelectDocumentsId.push(item.id));
      return documents.set("selected", new OrderedSet(allSelectDocumentsId));



    case SELECT_ALL_DOCUMENTS:
      const allDocumentsId: number[] = [];

      documents.entities.map((item: any) => allDocumentsId.push(item.id));

      return documents.set("selected", new OrderedSet(allDocumentsId));

    case UNSELECT_ALL_DOCUMENTS:
      return documents.set("selected", new OrderedSet([]));

  }

  return documents;
};
