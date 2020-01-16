import * as fs from "fs";
import { OrderedMap, Record } from "immutable";
import {
  ACTIVE_SETTING, ADD_RECIPIENT_CERTIFICATE, APPLY_SETTINGS, BASE64,
  CHANGE_ARCHIVE_FILES_BEFORE_ENCRYPT, CHANGE_DEFAULT_SETTINGS,
  CHANGE_DELETE_FILES_AFTER_ENCRYPT, CHANGE_DSS_AUTH_URL, CHANGE_DSS_REST_URL, CHANGE_ECRYPT_ALGORITHM,
  CHANGE_ECRYPT_ENCODING, CHANGE_LOCALE, CHANGE_OCSP_PROXY_LOGIN,
  CHANGE_OCSP_PROXY_PASSWORD, CHANGE_OCSP_PROXY_PORT, CHANGE_OCSP_PROXY_URL,
  CHANGE_OCSP_URL, CHANGE_OCSP_USE_PROXY, CHANGE_OUTFOLDER,
  CHANGE_SETTINGS_NAME, CHANGE_SIGNATURE_DETACHED, CHANGE_SIGNATURE_ENCODING, CHANGE_SIGNATURE_STANDARD,
  CHANGE_SIGNATURE_TIME, CHANGE_SIGNATURE_TIMESTAMP, CHANGE_SIGNATURE_TIMESTAMP_ON_SIGN, CHANGE_TSP_PROXY_LOGIN, CHANGE_TSP_PROXY_PASSWORD,
  CHANGE_TSP_PROXY_PORT, CHANGE_TSP_PROXY_URL, CHANGE_TSP_URL, CHANGE_TSP_USE_PROXY, CREATE_SETTING,
  DELETE_RECIPIENT_CERTIFICATE, DELETE_SETTING, GOST_28147, REMOVE_ALL_CERTIFICATES, RU, SAVE_SETTINGS, SELECT_SIGNER_CERTIFICATE, SETTINGS_JSON, TOGGLE_SAVE_TO_DOCUMENTS,
} from "../constants";
import { fileExists, mapToArr, uuid } from "../utils";

export const RecipientModel = Record({
  certId: null,
});

export interface ISignModel {
  detached: boolean;
  encoding: string;
  signer: string;
  standard: string;
  time: boolean;
  timestamp_on_data: boolean;
  timestamp_on_sign: boolean;
}

export interface ITspModel {
  proxy_login: string;
  proxy_password: string;
  proxy_port: string;
  proxy_url: string;
  url: string;
  use_proxy: boolean;
}

export interface IOcspModel {
  proxy_login: string;
  proxy_password: string;
  proxy_port: string;
  proxy_url: string;
  url: string;
  use_proxy: boolean;
}

export interface ISignParams {
  signModel: ISignModel;
  tspModel: ITspModel;
  ocspModel: IOcspModel;
}

export const SignModel = Record({
  detached: false,
  encoding: BASE64,
  signer: "",
  standard: "CMS",
  time: true,
  timestamp_on_data: false,
  timestamp_on_sign: false,
});

export const EncryptModel = Record({
  algorithm: GOST_28147,
  archive: false,
  delete: false,
  encoding: BASE64,
  recipients: OrderedMap({}),
});

export const TspModel = Record({
  proxy_login: "",
  proxy_password: "",
  proxy_port: "",
  proxy_url: "",
  url: "",
  use_proxy: false,
});

export const OcspModel = Record({
  proxy_login: "",
  proxy_password: "",
  proxy_port: "",
  proxy_url: "",
  url: "",
  use_proxy: false,
});

const DEFAULT_ID = "DEFAULT_ID";

export const SettingsModel = Record({
  changed: false,
  encrypt: new EncryptModel(),
  id: DEFAULT_ID,
  locale: RU,
  name: "Настройка #1",
  ocsp: new OcspModel(),
  outfolder: "",
  saveToDocuments: false,
  savetime: null,
  sign: new SignModel(),
  tsp: new TspModel(),
});

export const DefaultReducerState = Record({
  active: null,
  default: DEFAULT_ID,
  entities: OrderedMap({
    DEFAULT_ID: new SettingsModel(),
  }),
});

let unsavedSettings: any; //сохраняем исходное состояние активной настрйоки

export default (settings = new DefaultReducerState(), action) => {
  const { type, payload } = action;

  let name;
  let setting;

  if (payload) {
    name = payload.name;
    setting = payload.setting;
  }

  let modifiedSettings;

  switch (type) {
    case CREATE_SETTING:
      const id = uuid();

      settings = settings.setIn(["entities", id], new SettingsModel({
        id,
        name: name ? name : `Настройка #${settings.entities.size + 1}`,
      }));

      if (unsavedSettings) {
        settings = settings
          .setIn(["entities", unsavedSettings.id], unsavedSettings);
      }

      settings = settings.set("active", id);
      settings = settings.set("default", id);

      if (payload && payload.setting) {
        let newSetting = payload.setting;

        newSetting = newSetting.set("id", id);
        newSetting = newSetting.set("name", name);
        newSetting = newSetting.set("changed", false);

        settings = settings
          .setIn(["entities", settings.active], newSetting);

        unsavedSettings = newSetting;
      }

      break;

    case SAVE_SETTINGS:
      unsavedSettings = settings.getIn(["entities", settings.active])
        .set("changed", false);
      break;

    case APPLY_SETTINGS:
      settings = settings
        .setIn(["entities", settings.active], payload.settings);
      break;

    case ACTIVE_SETTING:
      if (!unsavedSettings) {
        unsavedSettings = settings.getIn(["entities", payload.id]);
      }

      return settings.set("active", payload.id);

    case DELETE_SETTING:
      if (settings.default === payload.id || DEFAULT_ID === payload.id) {
        return settings;
      }

      settings = settings.deleteIn(["entities", payload.id]);
      break;

    case CHANGE_DEFAULT_SETTINGS:
      unsavedSettings = settings.getIn(["entities", payload.id]);
      settings = settings.set("default", payload.id);
      break;

    case TOGGLE_SAVE_TO_DOCUMENTS:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "saveToDocuments"], payload.saveToDocuments);
      break;

    case CHANGE_SETTINGS_NAME:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "name"], payload.name);
      break;

    case CHANGE_SIGNATURE_DETACHED:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "sign", "detached"], payload.detached);
      break;

    case CHANGE_SIGNATURE_ENCODING:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "sign", "encoding"], payload.encoding);
      break;

    case CHANGE_OUTFOLDER:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "outfolder"], payload.outfolder);
      break;

    case CHANGE_SIGNATURE_STANDARD:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "sign", "standard"], payload.standard);
      break;

    case CHANGE_SIGNATURE_TIME:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "sign", "time"], payload.time);
      break;

    case CHANGE_SIGNATURE_TIMESTAMP:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "sign", "timestamp_on_data"], payload.timestamp);
      break;

    case CHANGE_SIGNATURE_TIMESTAMP_ON_SIGN:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "sign", "timestamp_on_sign"], payload.timestamp);
      break;

    case CHANGE_ARCHIVE_FILES_BEFORE_ENCRYPT:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "encrypt", "archive"], payload.archive);
      break;

    case CHANGE_DELETE_FILES_AFTER_ENCRYPT:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "encrypt", "delete"], payload.del);
      break;

    case CHANGE_ECRYPT_ALGORITHM:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "encrypt", "algorithm"], payload.algorithm);
      break;

    case CHANGE_ECRYPT_ENCODING:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "encrypt", "encoding"], payload.encoding);
      break;

    case CHANGE_TSP_PROXY_PORT:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "tsp", "proxy_port"], payload.port);
      break;

    case CHANGE_TSP_PROXY_URL:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "tsp", "proxy_url"], payload.url);
      break;

    case CHANGE_TSP_URL:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "tsp", "url"], payload.url);
      break;

    case CHANGE_TSP_PROXY_LOGIN:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "tsp", "proxy_login"], payload.proxy_login);
      break;

    case CHANGE_TSP_PROXY_PASSWORD:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "tsp", "proxy_password"], payload.proxy_password);
      break;

    case CHANGE_TSP_USE_PROXY:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "tsp", "use_proxy"], payload.use_proxy);
      break;

    case CHANGE_OCSP_PROXY_PORT:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "ocsp", "proxy_port"], payload.port);
      break;

    case CHANGE_OCSP_PROXY_URL:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "ocsp", "proxy_url"], payload.url);
      break;

    case CHANGE_OCSP_URL:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "ocsp", "url"], payload.url);
      break;

    case CHANGE_OCSP_USE_PROXY:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "ocsp", "use_proxy"], payload.use_proxy);
      break;

    case CHANGE_OCSP_PROXY_LOGIN:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "ocsp", "proxy_login"], payload.proxy_login);
      break;

    case CHANGE_OCSP_PROXY_PASSWORD:
      modifiedSettings = settings
        .setIn(["entities", settings.active, "ocsp", "proxy_password"], payload.proxy_password);
      break;

    case CHANGE_LOCALE:
      settings = settings.set("active", settings.default);

      settings = settings
        .setIn(["entities", settings.active, "locale"], payload.locale);
      break;

    case SELECT_SIGNER_CERTIFICATE:
      if (!settings.active) {
        settings = settings.set("active", settings.default);
      }

      modifiedSettings = settings
        .setIn(["entities", settings.active, "sign", "signer"], payload.selected);
      break;

    case ADD_RECIPIENT_CERTIFICATE:
      if (!settings.active) {
        settings = settings.set("active", settings.default);
      }

      modifiedSettings = settings
        .setIn(["entities", settings.active, "encrypt", "recipients", payload.certId], new RecipientModel({
          certId: payload.certId,
        }));
      break;

    case DELETE_RECIPIENT_CERTIFICATE:
      if (!settings.active) {
        settings = settings.set("active", settings.default);
      }

      modifiedSettings = settings
        .deleteIn(["entities", settings.active, "encrypt", "recipients", payload.recipient]);
      break;
  }

  if (type === SELECT_SIGNER_CERTIFICATE
    || type === ADD_RECIPIENT_CERTIFICATE
    || type === DELETE_RECIPIENT_CERTIFICATE
    || type === CHANGE_SIGNATURE_STANDARD
    || type === TOGGLE_SAVE_TO_DOCUMENTS
    || type === CHANGE_SIGNATURE_DETACHED
    || type === CHANGE_SIGNATURE_ENCODING
    || type === CHANGE_OUTFOLDER
    || type === CHANGE_SIGNATURE_TIME
    || type === CHANGE_SIGNATURE_TIMESTAMP
    || type === CHANGE_SIGNATURE_TIMESTAMP_ON_SIGN
    || type === CHANGE_ARCHIVE_FILES_BEFORE_ENCRYPT
    || type === CHANGE_DELETE_FILES_AFTER_ENCRYPT
    || type === CHANGE_ECRYPT_ENCODING
    || type === CHANGE_ECRYPT_ALGORITHM
    || type === CHANGE_TSP_PROXY_PORT
    || type === CHANGE_TSP_PROXY_URL
    || type === CHANGE_TSP_URL
    || type === CHANGE_TSP_USE_PROXY
    || type === CHANGE_TSP_PROXY_LOGIN
    || type === CHANGE_TSP_PROXY_PASSWORD
    || type === CHANGE_OCSP_PROXY_PORT
    || type === CHANGE_OCSP_PROXY_URL
    || type === CHANGE_OCSP_URL
    || type === CHANGE_OCSP_USE_PROXY
    || type === CHANGE_OCSP_PROXY_LOGIN
    || type === CHANGE_OCSP_PROXY_PASSWORD
  ) {
    if (modifiedSettings && !modifiedSettings.equals(settings)) {
      settings = modifiedSettings;
      settings = settings
        .setIn(["entities", settings.active, "changed"], true);
    }
  }

  if (type === SAVE_SETTINGS
    || type === CREATE_SETTING) {
    settings = settings
      .setIn(["entities", settings.active, "savetime"], new Date().getTime())
      .setIn(["entities", settings.active, "changed"], false);

    const state = ({
      default: settings.default,
      settings: settings.toJS(),
    });

    state.settings = mapToArr(settings.entities);

    const newSettings = [];

    for (let setting of state.settings) {
      if (setting && setting.encrypt) {
        setting = setting.setIn(["encrypt", "recipients"], mapToArr(setting.encrypt.recipients));
      }

      newSettings.push(setting);
    }

    state.settings = newSettings;

    const sstate = JSON.stringify(state, null, 4);
    fs.writeFile(SETTINGS_JSON, sstate, (err: any) => {
      if (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
      }
    });

  }

  window.unsavedSettings = unsavedSettings;

  return settings;
};
