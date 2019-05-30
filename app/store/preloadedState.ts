import * as fs from "fs";
import { SETTINGS_JSON } from "../constants";
import { DefaultReducerState as DefaultRecipientsReducerState, RecipientModel } from "../reducer/recipients";
import { DefaultReducerState as DefaultSettingsState, EncryrptModel, SettingsModel as GlobalSettingsModel, SignModel } from "../reducer/settings";
import { fileExists } from "../utils";

let odata = {};

if (fileExists(SETTINGS_JSON)) {
  const data = fs.readFileSync(SETTINGS_JSON, "utf8");

  if (data) {
    try {
      let recipientsMap = new DefaultRecipientsReducerState();

      odata = JSON.parse(data);

      for (const recipient of odata.recipients) {
        recipientsMap = recipientsMap.setIn(["entities", recipient.certId], new RecipientModel({
          certId: recipient.certId,
        }));
      }

      odata.recipients = recipientsMap;

      let settingsMap = new DefaultSettingsState();

      for (const setting of odata.settings) {
        settingsMap = settingsMap.setIn(["entities", setting.id], new GlobalSettingsModel({
          ...setting,
          encrypt: new EncryrptModel(setting.encrypt),
          id: setting.id,
          sign: new SignModel(setting.sign),
        }));
      }

      if (odata.default && settingsMap) {
        settingsMap = settingsMap.set("default", odata.default);
      }

      odata.settings = settingsMap;

      if (odata.settings && !odata.settings.cloudCSP) {
        odata.settings.cloudCSP = {
          authURL: "https://dss.cryptopro.ru/STS/oauth",
          restURL: "https://dss.cryptopro.ru/SignServer/rest",
        };
      }
    } catch (e) {
      odata = {};
    }
  }
}

export default odata;
