import {
  ACTIVE_SETTING, APPLY_SETTINGS, CHANGE_ARCHIVE_FILES_BEFORE_ENCRYPT,
  CHANGE_DEFAULT_SETTINGS, CHANGE_DELETE_FILES_AFTER_ENCRYPT, CHANGE_ECRYPT_ENCODING,
  CHANGE_LOCALE, CHANGE_OUTFOLDER, CHANGE_SETTINGS_NAME,
  CHANGE_SIGNATURE_DETACHED, CHANGE_SIGNATURE_ENCODING,
  CHANGE_SIGNATURE_STANDARD, CHANGE_SIGNATURE_TIMESTAMP, CREATE_SETTING,
  DEFAULT_DOCUMENTS_PATH, DELETE_SETTING, TOGGLE_SAVE_TO_DOCUMENTS, CHANGE_SIGNATURE_TIMESTAMP_ON_SIGN,
} from "../constants";

export function createSettings() {
  return {
    type: CREATE_SETTING,
  };
}

export function changeDefaultSettings(id: string) {
  return {
    payload: { id },
    type: CHANGE_DEFAULT_SETTINGS,
  };
}

export function activeSetting(id: string) {
  return {
    payload: { id },
    type: ACTIVE_SETTING,
  };
}

export function deleteSetting(id: string) {
  return {
    payload: { id },
    type: DELETE_SETTING,
  };
}

export function applySettings(settings: any) {

  return {
    payload: { settings },
    type: APPLY_SETTINGS,
  };
}

export function toggleSaveToDocuments(saveToDocuments: boolean) {

  return (dispatch: (action: {}) => void) => {

    if (saveToDocuments) {

      dispatch(changeOutfolder(DEFAULT_DOCUMENTS_PATH));

    } else {

      dispatch(changeOutfolder(""));
    }

    dispatch({
      payload: { saveToDocuments },
      type: TOGGLE_SAVE_TO_DOCUMENTS,
    });

  };
}

export function changeSettingsName(name: string) {
  return {
    payload: { name },
    type: CHANGE_SETTINGS_NAME,
  };
}

export function changeOutfolder(outfolder: string) {
  return {
    payload: { outfolder },
    type: CHANGE_OUTFOLDER,
  };
}

export function changeEncryptEncoding(encoding: string) {
  return {
    payload: { encoding },
    type: CHANGE_ECRYPT_ENCODING,
  };
}

export function changeDeleteFilesAfterEncrypt(del: boolean) {
  return {
    payload: { del },
    type: CHANGE_DELETE_FILES_AFTER_ENCRYPT,
  };
}

export function changeArchiveFilesBeforeEncrypt(archive: boolean) {
  return {
    payload: { archive },
    type: CHANGE_ARCHIVE_FILES_BEFORE_ENCRYPT,
  };
}

export function changeSignatureStandard(standard: string) {
  return {
    payload: { standard },
    type: CHANGE_SIGNATURE_STANDARD,
  };
}

export function changeSignatureEncoding(encoding: string) {
  return {
    payload: { encoding },
    type: CHANGE_SIGNATURE_ENCODING,
  };
}

export function changeSignatureDetached(detached: boolean) {
  return {
    payload: { detached },
    type: CHANGE_SIGNATURE_DETACHED,
  };
}

export function changeSignatureTimestamp(timestamp: boolean) {
  return {
    payload: { timestamp },
    type: CHANGE_SIGNATURE_TIMESTAMP,
  };
}

export function changeSignatureTimestampOnSign(timestamp: boolean) {
  return {
    payload: { timestamp },
    type: CHANGE_SIGNATURE_TIMESTAMP_ON_SIGN,
  };
}

export function changeLocale(locale: string) {
  return {
    payload: { locale },
    type: CHANGE_LOCALE,
  };
}
