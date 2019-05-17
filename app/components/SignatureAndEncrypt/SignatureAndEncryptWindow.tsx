import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { activeFile, deleteFile, filePackageDelete, filePackageSelect, selectFile } from "../../AC";
import {
  DECRYPT, ENCRYPT,
  SIGN, UNSIGN, VERIFY,
} from "../../constants";
import { activeFilesSelector } from "../../selectors";
import { bytesToSize, mapToArr } from "../../utils";
import FilterDocuments from "../Documents/FilterDocuments";
import FileSelector from "../Files/FileSelector";
import Modal from "../Modal";

const dialog = window.electron.remote.dialog;

interface ISignatureAndEncryptWindowProps {
  isDefaultFilters: boolean;
}

interface ISignatureAndEncryptWindowState {
  currentOperation: string;
  searchValue: string;
  showModalDeleteDocuments: boolean;
  showModalFilterDocments: boolean;
}

class SignatureAndEncryptWindow extends React.Component<ISignatureAndEncryptWindowProps, ISignatureAndEncryptWindowState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: ISignatureAndEncryptWindowProps) {
    super(props);

    this.state = {
      currentOperation: "",
      searchValue: "",
      showModalDeleteDocuments: false,
      showModalFilterDocments: false,
    };
  }

  componentDidMount() {
    $(".btn-floated").dropdown({
      alignment: "left",
      belowOrigin: false,
      gutter: 0,
      inDuration: 300,
      outDuration: 225,
    });
  }

  render() {
    const { localize, locale } = this.context;
    const { isDefaultFilters } = this.props;
    const classDefaultFilters = isDefaultFilters ? "filter_off" : "filter_on";

    return (
      <div className="content-noflex">
        <div className="row">
          <div className="col s8 leftcol">
            <div className="row halfbottom">
              <div className="row halfbottom" />
              <div className="col" style={{ width: "40px" }}>
                <a onClick={this.addFiles.bind(this)}>
                  <i className="file-setting-item waves-effect material-icons secondary-content">add</i>
                </a>
              </div>
              <div className="col" style={{ width: "calc(100% - 120px)" }}>
                <div className="input-field input-field-csr col s12 border_element find_box">
                  <i className="material-icons prefix">search</i>
                  <input
                    id="search"
                    type="search"
                    placeholder={localize("EventsTable.search_in_doclist", locale)}
                    value={this.state.searchValue}
                    onChange={this.handleSearchValueChange} />
                  <i className="material-icons close" onClick={() => this.setState({ searchValue: "" })} style={this.state.searchValue ? { color: "#444" } : {}}>close</i>
                </div>
              </div>
              <div className="col" style={{ width: "40px" }}>
                <a onClick={this.handleShowModalFilterDocuments}>
                  <i className="file-setting-item waves-effect material-icons secondary-content">filter_list</i>
                </a>
              </div>
              <div className="col" style={{ width: "40px" }}>
                <div>
                  <a className="btn-floated" data-activates="dropdown-btn-set-add-files">
                    <i className="file-setting-item waves-effect material-icons secondary-content">more_vert</i>
                  </a>
                  <ul id="dropdown-btn-set-add-files" className="dropdown-content">
                    <li><a onClick={this.selectedAll}>{localize("Settings.selected_all", locale)}</a></li>
                    <li><a onClick={this.removeSelectedAll}>{localize("Settings.remove_selected", locale)}</a></li>
                    <li><a onClick={this.removeAllFiles}>{localize("Settings.remove_all_files", locale)}</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <FileSelector operation="SIGN" />
          </div>
          <div className="col s4 rightcol">
            <div className="row halfbottom" />
            <div className="col s12">
              <div className="desktoplic_text_item bottomitem">Выбранные элементы:</div>
            </div>
            <div className="col s11">
              <div className="col s12">
                <div className="desktoplic_text_item topitem">{`Количество: ${this.props.activeFiles.length}`}</div>
              </div>
              <div className="col s12">
                <div className="desktoplic_text_item topitem">{`Общий объем: ${this.getSelectedFilesSize()}`}</div>
              </div>
            </div>

            <div className="row" />
            <div className="col s12">
              <div className="desktoplic_text_item bottomitem">Доступные операции:</div>
            </div>
            <div className="row" />
            <div className="row" >
              <div className="col s4">
                <a className={`waves-effect waves-light  ${this.checkEnableOperationButton(SIGN) ? "" : "disabled_docs"}`}
                  data-position="bottom"
                  onClick={this.handleClickSign}>
                  <div className="row docmenu">
                    <i className="material-icons docmenu_sign" />
                  </div>
                  <div className="row docmenu">{localize("Documents.docmenu_sign", locale)}</div>
                </a>
              </div>
              <div className="col s4">
                <a className={`waves-effect waves-light  ${this.checkEnableOperationButton(VERIFY) ? "" : "disabled_docs"}`}
                  data-position="bottom"
                  data-tooltip={localize("Sign.sign_and_verify", locale)}>
                  <div className="row docmenu">
                    <i className="material-icons docmenu_verifysign" />
                  </div>
                  <div className="row docmenu">{localize("Documents.docmenu_verifysign", locale)}</div>
                </a>
              </div>
              <div className="col s4">
                <a className={`waves-effect waves-light ${this.checkEnableOperationButton(UNSIGN) ? "" : "disabled_docs"}`} data-position="bottom">
                  <div className="row docmenu">
                    <i className="material-icons docmenu_removesign" />
                  </div>
                  <div className="row docmenu">{localize("Documents.docmenu_removesign", locale)}</div>
                </a>
              </div>
            </div>
            <div className="col s4">
              <a className={`waves-effect waves-light ${this.checkEnableOperationButton(ENCRYPT) ? "" : "disabled_docs"}`}
                data-position="bottom" onClick={this.handleClickEncrypt}>
                <div className="row docmenu">
                  <i className="material-icons docmenu_encrypt" />
                </div>
                <div className="row docmenu">{localize("Documents.docmenu_enctypt", locale)}</div>
              </a>
            </div>
            <div className="col s4">
              <a className={`waves-effect waves-light ${this.checkEnableOperationButton(DECRYPT) ? "" : "disabled_docs"}`} data-position="bottom">
                <div className="row docmenu">
                  <i className="material-icons docmenu_decrypt" />
                </div>
                <div className="row docmenu">{localize("Documents.docmenu_dectypt", locale)}</div>
              </a>
            </div>
            <div className="row" />
            <div className="col s12">
              <div className="desktoplic_text_item bottomitem">Выполняется:</div>
            </div>
            <div className="col s12">
              <div className="desktoplic_text_item topitem">{this.state.currentOperation}</div>
            </div>

            <div className="row" />
            <div className="col s12">
              <div className="desktoplic_text_item bottomitem">Сертификат подписчика:</div>
            </div>
          </div>
        </div>
        {this.showModalFilterDocuments()}
      </div>
    );
  }

  selectedAll = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { files, activeFile } = this.props;

    for (const file of files) {
      activeFile(file.id);
    }
  }

  removeSelectedAll = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { files, activeFile } = this.props;

    for (const file of files) {
      activeFile(file.id, false);
    }
  }

  removeAllFiles = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { filePackageDelete, files } = this.props;

    const filePackage: number[] = [];

    for (const file of files) {
      filePackage.push(file.id);
    }

    filePackageDelete(filePackage);
  }

  checkEnableOperationButton = (operation: string) => {
    const { activeFiles } = this.props;

    if (!activeFiles.length) {
      return false;
    }

    switch (operation) {
      case SIGN:
        for (const document of activeFiles) {
          if (document.extname === ".enc") {
            return false;
          }
        }

        return true;

      case VERIFY:
      case UNSIGN:
        for (const document of activeFiles) {
          if (document.extname !== ".sig") {
            return false;
          }
        }

        return true;

      case ENCRYPT:
        for (const document of activeFiles) {
          if (document.extname === ".enc") {
            return false;
          }
        }

        return true;

      case DECRYPT:
        for (const document of activeFiles) {
          if (document.extname !== ".enc") {
            return false;
          }
        }

        return true;

      default:
        return false;
    }
  }

  addFiles() {
    // tslint:disable-next-line:no-shadowed-variable
    const { filePackageSelect } = this.props;

    dialog.showOpenDialog(null, { properties: ["openFile", "multiSelections"] }, (selectedFiles: string[]) => {
      if (selectedFiles) {
        const pack: IFilePath[] = [];

        selectedFiles.forEach((file) => {
          pack.push({ fullpath: file });
        });

        filePackageSelect(pack);
      }
    });
  }

  handleClickSign = () => {
    this.setState({ currentOperation: SIGN });
  }

  handleClickEncrypt = () => {
    this.setState({ currentOperation: ENCRYPT });
  }

  getSelectedFilesSize = () => {
    const { activeFiles } = this.props;

    let sizeInBytes = 0;

    for (const document of activeFiles) {
      sizeInBytes += document.filesize;
    }

    return bytesToSize(sizeInBytes);
  }

  showModalFilterDocuments = () => {
    const { localize, locale } = this.context;
    const { showModalFilterDocments } = this.state;

    if (!showModalFilterDocments) {
      return;
    }

    return (
      <Modal
        isOpen={showModalFilterDocments}
        header={localize("Filters.filters_settings", locale)}
        onClose={this.handleCloseModalFilterDocuments}>

        <FilterDocuments onCancel={this.handleCloseModalFilterDocuments} />
      </Modal>
    );
  }

  handleSearchValueChange = (ev: any) => {
    this.setState({ searchValue: ev.target.value });
  }

  handleShowModalFilterDocuments = () => {
    this.setState({ showModalFilterDocments: true });
  }

  handleCloseModalFilterDocuments = () => {
    this.setState({ showModalFilterDocments: false });
  }
}

export default connect((state) => {
  return {
    activeFiles: activeFilesSelector(state, { active: true }),
    files: mapToArr(state.files.entities),
    isDefaultFilters: state.filters.documents.isDefaultFilters,
  };
}, { activeFile, deleteFile, filePackageSelect, filePackageDelete, selectFile })(SignatureAndEncryptWindow);
