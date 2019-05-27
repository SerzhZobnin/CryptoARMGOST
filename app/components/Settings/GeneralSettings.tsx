import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  changeArchiveFilesBeforeEncrypt, changeDeleteFilesAfterEncrypt,
  changeEncryptEncoding, changeEncryptOutfolder, toggleSaveToDocuments,
} from "../../AC";
import { DEFAULT_DOCUMENTS_PATH } from "../../constants";
import CheckBoxWithLabel from "../CheckBoxWithLabel";
import SelectFolder from "../SelectFolder";

const dialog = window.electron.remote.dialog;

interface IEncryptSettingsProps {
  changeDeleteFilesAfterEncrypt: (del: boolean) => void;
  changeEncryptOutfolder: (path: string) => void;
  changeEncryptEncoding: (encoding: string) => void;
  changeArchiveFilesBeforeEncrypt: (archive: boolean) => void;
  saveToDocuments: boolean;
  settings: {
    archive: boolean,
    delete: boolean,
    encoding: string,
    outfolder: string,
    saveToDocuments: boolean,
  };
  toggleSaveToDocuments: (saveToDocuments: boolean) => void;
}

class GeneralSettings extends React.Component<IEncryptSettingsProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  addDirect() {
    // tslint:disable-next-line:no-shadowed-variable
    const { changeEncryptOutfolder } = this.props;

    if (!window.framework_NW) {
      const directory = dialog.showOpenDialog({ properties: ["openDirectory"] });
      if (directory) {
        changeEncryptOutfolder(directory[0]);
      }
    } else {
      const clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent("click", true, true);
      document.querySelector("#choose-folder").dispatchEvent(clickEvent);
    }
  }

  handleOutfolderChange = (ev: any) => {
    ev.preventDefault();
    // tslint:disable-next-line:no-shadowed-variable
    const { changeEncryptOutfolder } = this.props;
    changeEncryptOutfolder(ev.target.value);
  }

  handleSaveToDocumentsClick = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { toggleSaveToDocuments, saveToDocuments } = this.props;

    toggleSaveToDocuments(!saveToDocuments);
  }

  render() {
    const { saveToDocuments, settings } = this.props;
    const { localize, locale } = this.context;

    return (
      <div className="settings-content">
        <CheckBoxWithLabel onClickCheckBox={this.handleSaveToDocumentsClick}
          isChecked={saveToDocuments}
          elementId="saveToDocuments"
          title={localize("Documents.save_to_documents", locale)} />
        <SelectFolder
          directory={saveToDocuments ? DEFAULT_DOCUMENTS_PATH : settings.outfolder}
          viewDirect={this.handleOutfolderChange}
          openDirect={this.addDirect.bind(this)}
        />
      </div>
    );
  }
}

export default connect((state) => ({
  saveToDocuments: state.settings.saveToDocuments,
  settings: state.settings.encrypt,
}), { changeArchiveFilesBeforeEncrypt, changeDeleteFilesAfterEncrypt, changeEncryptEncoding, changeEncryptOutfolder, toggleSaveToDocuments }, null, { pure: false })(GeneralSettings);
