import { OrderedMap, Record } from "immutable";
import {
  ACTIVE_SETTING, ADD_RECIPIENT_CERTIFICATE, BASE64,
  CHANGE_ARCHIVE_FILES_BEFORE_ENCRYPT, CHANGE_DEFAULT_SETTINGS,
  CHANGE_DELETE_FILES_AFTER_ENCRYPT, CHANGE_DSS_AUTH_URL, CHANGE_DSS_REST_URL, CHANGE_ECRYPT_ENCODING,
  CHANGE_ENCRYPT_OUTFOLDER, CHANGE_LOCALE, CHANGE_SETTINGS_NAME,
  CHANGE_SIGNATURE_DETACHED, CHANGE_SIGNATURE_ENCODING, CHANGE_SIGNATURE_OUTFOLDER, CHANGE_SIGNATURE_TIMESTAMP,
  CREATE_SETTING, DELETE_RECIPIENT_CERTIFICATE, DELETE_SETTING,
  REMOVE_ALL_CERTIFICATES, RU, SELECT_SIGNER_CERTIFICATE, TOGGLE_SAVE_TO_DOCUMENTS,
} from "../constants";
import { uuid } from "../utils";

export const RecipientModel = Record({
  certId: null,
});

export const SignModel = Record({
  detached: false,
  encoding: BASE64,
  signer: "",
  timestamp: true,
});

export const EncryptModel = Record({
  archive: false,
  delete: false,
  encoding: BASE64,
  recipients: OrderedMap({}),
});

const DEFAULT_ID = "DEFAULT_ID";

export const SettingsModel = Record({
  encrypt: new EncryptModel(),
  id: DEFAULT_ID,
  locale: RU,
  mtime: null,
  name: "Настройка #1",
  outfolder: "",
  saveToDocuments: false,
  sign: new SignModel(),
});

export const DefaultReducerState = Record({
  active: null,
  default: DEFAULT_ID,
  entities: OrderedMap({
    DEFAULT_ID: new SettingsModel({ mtime: new Date().getTime() }),
  }),
});

export default (settings = new DefaultReducerState(), action) => {
  const { type, payload } = action;
  switch (type) {
    case CREATE_SETTING:
      const id = uuid();

      return settings.setIn(["entities", id], new SettingsModel({
        id,
        mtime: new Date().getTime(),
        name: `Настройка #${settings.entities.size + 1}`,
      }));

    case ACTIVE_SETTING:
      return settings.set("active", payload.id);

    case DELETE_SETTING:
      if (settings.default === payload.id || DEFAULT_ID === payload.id) {
        return settings;
      }

      return settings.deleteIn(["entities", payload.id]);

    case CHANGE_DEFAULT_SETTINGS:
      return settings.set("default", payload.id);

    case TOGGLE_SAVE_TO_DOCUMENTS:
      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "saveToDocuments"], payload.saveToDocuments);

    case CHANGE_SETTINGS_NAME:
      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "name"], payload.name);

    case CHANGE_SIGNATURE_DETACHED:
      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "sign", "detached"], payload.detached);

    case CHANGE_SIGNATURE_ENCODING:
      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "sign", "encoding"], payload.encoding);

    case CHANGE_SIGNATURE_OUTFOLDER:
      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "outfolder"], payload.outfolder);

    case CHANGE_SIGNATURE_TIMESTAMP:
      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "sign", "timestamp"], payload.timestamp);

    case CHANGE_ARCHIVE_FILES_BEFORE_ENCRYPT:
      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "encrypt", "archive"], payload.archive);

    case CHANGE_DELETE_FILES_AFTER_ENCRYPT:
      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "encrypt", "delete"], payload.del);

    case CHANGE_ECRYPT_ENCODING:
      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "encrypt", "encoding"], payload.encoding);

    case CHANGE_ENCRYPT_OUTFOLDER:
      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "outfolder"], payload.outfolder);

    case CHANGE_LOCALE:
      settings = settings.set("active", settings.default);

      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "locale"], payload.locale);

    case SELECT_SIGNER_CERTIFICATE:
      if (!settings.active) {
        settings = settings.set("active", settings.default);
      }

      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "sign", "signer"], payload.selected);

    case REMOVE_ALL_CERTIFICATES:
      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "sign", "signer"], "")
        .setIn(["entities", settings.active, "encrypt", "recipients"], OrderedMap({}));

    case ADD_RECIPIENT_CERTIFICATE:
      if (!settings.active) {
        settings = settings.set("active", settings.default);
      }

      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .setIn(["entities", settings.active, "encrypt", "recipients", payload.certId], new RecipientModel({
          certId: payload.certId,
        }));

    case DELETE_RECIPIENT_CERTIFICATE:
      if (!settings.active) {
        settings = settings.set("active", settings.default);
      }

      return settings
        .setIn(["entities", settings.active, "mtime"], new Date().getTime())
        .deleteIn(["entities", settings.active, "encrypt", "recipients", payload.recipient]);
  }

  return settings;
};
