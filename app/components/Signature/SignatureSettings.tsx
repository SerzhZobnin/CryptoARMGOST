import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  changeSignatureDetached, changeSignatureEncoding,
  changeSignatureOutfolder, changeSignatureTimestamp, toggleSaveToDocuments,
} from "../../AC/settingsActions";
import { loadingRemoteFilesSelector } from "../../selectors";
import { mapToArr } from "../../utils";
import CheckBoxWithLabel from "../CheckBoxWithLabel";
import EncodingTypeSelector from "../EncodingTypeSelector";

const dialog = window.electron.remote.dialog;

interface IFileRedux {
  active: boolean;
  extension: string;
  filename: string;
  fullpath: string;
  id: number;
  mtime: Date;
  remoteId: string;
  socket: string;
}

export interface IRemoteFile {
  extra: any;
  id: number;
  loaded: boolean;
  loading: boolean;
  name: string;
  socketId: string;
  totalSize: number;
  url: string;
}

interface ISignatureSettingsProps {
  changeSignatureTimestamp: (timestamp: boolean) => void;
  changeSignatureOutfolder: (path: string) => void;
  changeSignatureEncoding: (encoding: string) => void;
  changeSignatureDetached: (detached: boolean) => void;
  loadingFiles: IRemoteFile[];
  files: IFileRedux[];
  saveToDocuments: boolean;
  settings: {
    detached: boolean,
    encoding: string,
    outfolder: string,
    saveToDocuments: boolean,
    timestamp: boolean,
  };
  toggleSaveToDocuments: (saveToDocuments: boolean) => void;
}

class SignatureSettings extends React.Component<ISignatureSettingsProps, any> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  addDirect() {
    // tslint:disable-next-line:no-shadowed-variable
    const { changeSignatureOutfolder } = this.props;

    if (!window.framework_NW) {
      const directory = dialog.showOpenDialog({ properties: ["openDirectory"] });
      if (directory) {
        changeSignatureOutfolder(directory[0]);
      }
    } else {
      const clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent("click", true, true);
      document.querySelector("#choose-folder").dispatchEvent(clickEvent);
    }
  }

  handleDetachedClick = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { changeSignatureDetached, settings } = this.props;
    changeSignatureDetached(!settings.detached);
  }

  handleTimestampClick = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { changeSignatureTimestamp, settings } = this.props;
    changeSignatureTimestamp(!settings.timestamp);
  }

  handleSaveToDocumentsClick = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { toggleSaveToDocuments, saveToDocuments } = this.props;

    toggleSaveToDocuments(!saveToDocuments);
  }

  handleEncodingChange = (encoding: string) => {
    // tslint:disable-next-line:no-shadowed-variable
    const { changeSignatureEncoding } = this.props;
    changeSignatureEncoding(encoding);
  }

  render() {
    const { saveToDocuments, settings, signer } = this.props;
    const { localize, locale } = this.context;
    const disabled = this.getDisabled();

    let encoding = settings.encoding;

    if (signer && signer.service && encoding !== "BASE-64") {
      encoding = "BASE-64";
    }

    return (
      <div className="row settings-content">
        <div className="col s12 m12 l6">
          <EncodingTypeSelector
            EncodingValue={encoding}
            handleChange={this.handleEncodingChange}
            disabled={signer && signer.service} />
        </div>
        <div className="col s12 m12 l6">
          <CheckBoxWithLabel
            disabled={disabled}
            onClickCheckBox={this.handleDetachedClick}
            isChecked={settings.detached}
            elementId="detached-sign"
            title={localize("Sign.sign_detached", locale)} />
        </div>
        <div className="col s12 m6 m12 l6">
          <CheckBoxWithLabel onClickCheckBox={this.handleTimestampClick}
            disabled={disabled || (signer && signer.service)}
            isChecked={settings.timestamp || (signer && signer.service)}
            elementId="sign-time"
            title={localize("Sign.sign_time", locale)} />
        </div>
      </div>
    );
  }

  getDisabled = () => {
    const { files, loadingFiles } = this.props;

    if (loadingFiles.length) {
      return true;
    }

    if (files.length) {
      for (const file of files) {
        if (file.socket) {
          return true;
        }
      }
    }

    return false;
  }
}

export default connect((state) => ({
  files: mapToArr(state.files.entities),
  loadingFiles: loadingRemoteFilesSelector(state, { loading: true }),
  saveToDocuments: state.settings.getIn(["entities", state.settings.active]).saveToDocuments,
  settings: state.settings.getIn(["entities", state.settings.active]).sign,
  signer: state.certificates.getIn(["entities", state.settings.getIn(["entities", state.settings.active]).sign.signer]),
}), { changeSignatureDetached, changeSignatureEncoding, changeSignatureOutfolder, changeSignatureTimestamp, toggleSaveToDocuments }, null, { pure: false })(SignatureSettings);
