import { OrderedMap, Record } from "immutable";
import {
  BASE64, CHANGE_ARCHIVE_FILES_BEFORE_ENCRYPT, CHANGE_DELETE_FILES_AFTER_ENCRYPT,
  CHANGE_DSS_AUTH_URL, CHANGE_DSS_REST_URL, CHANGE_ECRYPT_ENCODING, CHANGE_ENCRYPT_OUTFOLDER,
  CHANGE_LOCALE, CHANGE_SETTINGS_NAME, CHANGE_SIGNATURE_DETACHED,
  CHANGE_SIGNATURE_ENCODING, CHANGE_SIGNATURE_OUTFOLDER, CHANGE_SIGNATURE_TIMESTAMP,
  RU, TOGGLE_SAVE_TO_DOCUMENTS,
} from "../constants";

export const SignModel = Record({
  detached: false,
  encoding: BASE64,
  outfolder: "",
  timestamp: true,
});

export const EncryrptModel = Record({
  archive: false,
  delete: false,
  encoding: BASE64,
  outfolder: "",
});

export const SettingsModel = Record({
  encrypt: new EncryrptModel(),
  id: "default_settings",
  locale: RU,
  name: "Настройка #1",
  saveToDocuments: false,
  sign: new SignModel(),
});

export const DefaultReducerState = Record({
  active: "default_settings",
  entities: OrderedMap({ "default_settings": new SettingsModel() }),
});

export default (settings = new DefaultReducerState(), action) => {
  const { type, payload } = action;
  switch (type) {
    case TOGGLE_SAVE_TO_DOCUMENTS:
      return settings.setIn(["entities", settings.active, "saveToDocuments"], payload.saveToDocuments);

    case CHANGE_SETTINGS_NAME:
      return settings.setIn(["entities", settings.active, "name"], payload.name);

    case CHANGE_SIGNATURE_DETACHED:
      return settings.setIn(["entities", settings.active, "sign", "detached"], payload.detached);

    case CHANGE_SIGNATURE_ENCODING:
      return settings.setIn(["entities", settings.active, "sign", "encoding"], payload.encoding);

    case CHANGE_SIGNATURE_OUTFOLDER:
      return settings.setIn(["entities", settings.active, "sign", "outfolder"], payload.outfolder);

    case CHANGE_SIGNATURE_TIMESTAMP:
      return settings.setIn(["entities", settings.active, "sign", "timestamp"], payload.timestamp);

    case CHANGE_ARCHIVE_FILES_BEFORE_ENCRYPT:
      return settings.setIn(["entities", settings.active, "encrypt", "archive"], payload.archive);

    case CHANGE_DELETE_FILES_AFTER_ENCRYPT:
      return settings.setIn(["entities", settings.active, "encrypt", "delete"], payload.del);

    case CHANGE_ECRYPT_ENCODING:
      return settings.setIn(["entities", settings.active, "encrypt", "encoding"], payload.encoding);

    case CHANGE_ENCRYPT_OUTFOLDER:
      return settings.setIn(["entities", settings.active, "encrypt", "outfolder"], payload.outfolder);

    case CHANGE_LOCALE:
      return settings.setIn(["entities", settings.active, "locale"], payload.locale);
  }

  return settings;
};
