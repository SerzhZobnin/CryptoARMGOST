import { List, Map, OrderedMap, OrderedSet, Record } from "immutable";
import {
  FAIL, MULTI_DIRECT_OPERATION, MULTI_REVERSE_OPERATION,
  SELECT_ALL_DOCUMENTS_IN_OPERAIONS_RESULT, SELECT_ARCHIVED_DOCUMENTS_IN_OPERAIONS_RESULT, SELECT_DOCUMENT_IN_OPERAIONS_RESULT,
  SELECT_ENCRYPTED_DOCUMENTS_IN_OPERAIONS_RESULT, SELECT_SIGNED_DOCUMENTS_IN_OPERAIONS_RESULT,
  START, SUCCESS, PART_SUCCESS, UNSELECT_ALL_DOCUMENTS_IN_OPERAIONS_RESULT,
  UNSELECT_DOCUMENT_IN_OPERAIONS_RESULT,
  VERIFY_LICENSE,
} from "../constants";
import { arrayToMap, fileExists } from "../utils";

export const FileModel = Record({
  active: false,
  extension: null,
  filename: null,
  filesize: null,
  fullpath: null,
  id: null,
  mtime: null,
  operation: null,
  originalId: null,
});

const DefaultReducerState = Record({
  entities: OrderedMap({}),
  files: OrderedMap({}),
  operations: OrderedMap({}),
  performed: false,
  performing: false,
  results: List(),
  selected: new OrderedSet([]),
  status: false,
});

export default (lastOperationResults = new DefaultReducerState(), action) => {
  const { type, payload } = action;

  switch (type) {
    case MULTI_REVERSE_OPERATION + START:
      lastOperationResults = new DefaultReducerState();
      return lastOperationResults
        .set("performing", true)
        .set("performed", false);

    case MULTI_DIRECT_OPERATION + START:
      lastOperationResults = new DefaultReducerState();
      return lastOperationResults
        .set("performing", true)
        .set("performed", false)
        .set("operations", OrderedMap(payload.operations));

    case MULTI_DIRECT_OPERATION + PART_SUCCESS:
      const oMapPart = OrderedMap(payload.directResult.files);

      return lastOperationResults
        .update("files", (files) => files.merge(oMapPart))
        .update("results", (results) => results.concat(List(payload.directResult.results)))
        .update("entities", (entities) => arrayToMap(getFilesArray(oMapPart), FileModel).merge(entities));

    case MULTI_DIRECT_OPERATION + SUCCESS:
      const oMap = OrderedMap(payload.directResult.files);

      return lastOperationResults
        .set("performing", false)
        .set("performed", true)
        .set("status", payload.status)
        .update("files", (files) => files.merge(oMap))
        .update("results", (results) => results.concat(List(payload.directResult.results)))
        .update("entities", (entities) => arrayToMap(getFilesArray(oMap), FileModel).merge(entities));

    case MULTI_REVERSE_OPERATION + SUCCESS:
      const oMapReverse = OrderedMap(payload.reverseResult.files);

      return lastOperationResults
        .set("performing", false)
        .set("performed", true)
        .set("status", payload.status)
        .set("files", oMapReverse)
        .set("results", List(payload.reverseResult.results))
        .update("entities", (entities) => arrayToMap(getFilesArray(oMapReverse), FileModel).merge(entities));

    case MULTI_REVERSE_OPERATION + FAIL:
    case MULTI_DIRECT_OPERATION + FAIL:
      return lastOperationResults
        .set("performing", false)
        .set("performed", false)
        .set("status", false);

    case SELECT_DOCUMENT_IN_OPERAIONS_RESULT:
      return lastOperationResults.update("selected", (selected) => selected.has(payload.uid)
        ? selected.remove(payload.uid)
        : selected.add(payload.uid),
      );

    case UNSELECT_DOCUMENT_IN_OPERAIONS_RESULT:
      return lastOperationResults.update("selected", (selected) => selected.remove(payload.uid));

    case SELECT_ALL_DOCUMENTS_IN_OPERAIONS_RESULT:
      const allDocumentsId: number[] = [];

      lastOperationResults.entities.map((item: any) => allDocumentsId.push(item.id));

      return lastOperationResults.set("selected", new OrderedSet(allDocumentsId));

    case UNSELECT_ALL_DOCUMENTS_IN_OPERAIONS_RESULT:
      return lastOperationResults.set("selected", new OrderedSet([]));

    case SELECT_SIGNED_DOCUMENTS_IN_OPERAIONS_RESULT:
      lastOperationResults = lastOperationResults.set("selected", new OrderedSet([]));

      const signedDocumentsId: number[] = [];

      lastOperationResults.entities.map((item: any) => {
        if (item.extension === "sig") {
          signedDocumentsId.push(item.id);
        }
      });

      return lastOperationResults.set("selected", new OrderedSet(signedDocumentsId));

    case SELECT_ENCRYPTED_DOCUMENTS_IN_OPERAIONS_RESULT:
      lastOperationResults = lastOperationResults.set("selected", new OrderedSet([]));

      const encryptedDocumentsId: number[] = [];

      lastOperationResults.entities.map((item: any) => {
        if (item.extension === "enc") {
          encryptedDocumentsId.push(item.id);
        }
      });

      return lastOperationResults.set("selected", new OrderedSet(encryptedDocumentsId));

    case SELECT_ARCHIVED_DOCUMENTS_IN_OPERAIONS_RESULT:
      lastOperationResults = lastOperationResults.set("selected", new OrderedSet([]));

      const archivedDocumentsId: number[] = [];

      lastOperationResults.entities.map((item: any) => {
        if (item.extension === "zip") {
          archivedDocumentsId.push(item.id);
        }
      });

      return lastOperationResults.set("selected", new OrderedSet(archivedDocumentsId));
  }

  return lastOperationResults;
};

const getFilesArray = (oMap: any) => {
  const files: any[] = [];
  oMap.valueSeq().forEach((v: any) => {
    if (v.original) {
      if (!files.find((file) => file.id === v.original.id)) {
        if (fileExists(v.original.fullpath)) {
          files.push(v.original);
        }
      }
    }

    if (v.signing_operation && v.signing_operation.result && v.signing_operation.out) {
      if (!files.find((file) => file.id === v.signing_operation.out.id)) {
        if (fileExists(v.signing_operation.out.fullpath)) {
          files.push(v.signing_operation.out);
        }
      }
    }

    if (v.archivation_operation && v.archivation_operation.result && v.archivation_operation.out) {
      if (!files.find((file) => file.id === v.archivation_operation.out.id)) {
        if (fileExists(v.archivation_operation.out.fullpath)) {
          files.push(v.archivation_operation.out);
        }
      }
    }

    if (v.encryption_operation && v.encryption_operation.result && v.encryption_operation.out) {
      if (!files.find((file) => file.id === v.encryption_operation.out.id)) {
        if (fileExists(v.encryption_operation.out.fullpath)) {
          files.push(v.encryption_operation.out);
        }
      }
    }

    if (v.decryption_operation && v.decryption_operation.result && v.decryption_operation.out) {
      if (!files.find((file) => file.id === v.decryption_operation.out.id)) {
        files.push(v.decryption_operation.out);
      }
    }

    if (v.unzip_operation && v.unzip_operation.result && v.unzip_operation.out && v.unzip_operation.out.unzipedFiles) {
      v.unzip_operation.out.unzipedFiles.forEach((unzipedFile: any) => {
        if (!files.find((file) => file.id === unzipedFile.id)) {
          files.push(unzipedFile);
        }
      });
    }

    if (v.unsign_operation && v.unsign_operation.result && v.unsign_operation.out) {
      if (!files.find((file) => file.id === v.unsign_operation.out.id)) {
        files.push(v.unsign_operation.out);
      }
    }
  });

  return files;
};
