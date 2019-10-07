import { OrderedSet, Record } from "immutable";

export const TemplateModel = Record({
  Description: null,
  Extensions: null,
  FriendlyName: null,
  MarkExportable: null,
  RDN: null,
});

export const DefaultReducerState = Record({
  entities: new OrderedSet([]),
});

export default (templates = new DefaultReducerState(), action) => {
  return templates;
};
