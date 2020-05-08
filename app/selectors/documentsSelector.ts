import { notEqual } from "assert";
import { createSelector } from "reselect";
import {
  ALL, ENCRYPTED, SIGNED,
} from "../constants";

export const documentsGetter = (state) => state.documents.entities;
export const filtersGetter = (state) => state.filters;

export const filteredDocumentsSelector = createSelector(documentsGetter, filtersGetter, (documents, filters) => {
  const { dateFrom, dateTo, filename, sizeFrom, sizeTo, types } = filters.documents;

  return documents.filter((document: any) => {
    return document.fullpath.match(filename) &&
      (sizeFrom ? document.filesize >= sizeFrom : true) &&
      (sizeTo ? document.filesize <= sizeTo : true) &&
      (dateFrom ? (new Date(document.mtime)).getTime() >= (new Date(dateFrom)).getTime() : true) &&
      (dateTo ? (new Date(document.mtime)).getTime() <= (new Date(dateTo.setHours(23, 59, 59, 999))).getTime() : true) &&
      (
        types[ENCRYPTED] && document.extension === "enc" ||
        types[SIGNED] && document.extension === "sig" ||
        (
          !types[ENCRYPTED] && !types[SIGNED]
        )
      );
  });
});

export const stateSelector = (state: any) => state.documents;
export const entitiesSelector = createSelector(stateSelector, (state) => state.entities);
export const selectionSelector = createSelector(stateSelector, (state) => state.selected.toArray());
export const selectedDocumentsSelector = createSelector(entitiesSelector, selectionSelector, (entities, selection) =>
  selection.map((uid: any) => entities.get(uid)),
);
export const selectedFiltredDocumentsSelector = createSelector (
  filteredDocumentsSelector, selectionSelector, (filter, selection) =>
  filter.filter ((entries: any) => {
    console.log (selection);
    return selection.some ((selectionFilter: any) => {
      return entries.id === selectionFilter;
    });
   }));
    // var item = selection.item ;
    // console.log (selection.indexOf (entries)); console.log (selection.uid);
    // console.log ("select", selection);
    // for (item of selection){console.log (item); }
    // return console.log ("df"); } ));
