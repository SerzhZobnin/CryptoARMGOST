import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  activeFile, deleteFile, deleteRecipient,
  filePackageDelete, filePackageSelect, selectFile,
  selectSignerCertificate,
} from "../../AC";
import {
  DECRYPT, ENCRYPT, LOCATION_CERTIFICATE_SELECTION_FOR_ENCRYPT,
  LOCATION_CERTIFICATE_SELECTION_FOR_SIGNATURE, REMOVE,
  SIGN, UNSIGN, VERIFY,
} from "../../constants";
import { activeFilesSelector } from "../../selectors";
import { bytesToSize, mapToArr } from "../../utils";
import FilterDocuments from "../Documents/FilterDocuments";
import FileSelector from "../Files/FileSelector";
import Modal from "../Modal";
import RecipientsList from "../RecipientsList";

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
    $(".btn-floated, .nav-small-btn").dropdown({
      alignment: "left",
      belowOrigin: false,
      gutter: 0,
      inDuration: 300,
      outDuration: 225,
    });
  }

  render() {
    const { localize, locale } = this.context;
    const { isDefaultFilters, recipients, signer } = this.props;
    const classDefaultFilters = isDefaultFilters ? "filter_off" : "filter_on";

    return (
      <div className="content-noflex">
        <div className="row">
          <div className="col s8 leftcol">
            <div className="row halfbottom">
              <div className="row halfbottom" />
              <div className="col" style={{ width: "40px", paddingLeft: "40px" }}>
                <a onClick={this.addFiles.bind(this)}>
                  <i className="file-setting-item waves-effect material-icons secondary-content pulse">add</i>
                </a>
              </div>
              <div className="col" style={{ width: "calc(100% - 140px)" }}>
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
            <div className="row" />
            <div className="col s10">
              <div className="desktoplic_text_item">Сертификат подписи:</div>
              <hr />
            </div>
            <div className="col s2">
              <div className="right import-col">
                <a className="btn-floated" data-activates="dropdown-btn-signer">
                  <i className="file-setting-item waves-effect material-icons secondary-content">more_vert</i>
                </a>
                <ul id="dropdown-btn-signer" className="dropdown-content">
                  <li><a onClick={() => this.props.selectSignerCertificate(0)}>Очистить</a></li>
                </ul>
              </div>
            </div>
            {
              (signer) ? this.getSelectedSigner() :
                <div className="col s12">
                  <Link to={LOCATION_CERTIFICATE_SELECTION_FOR_SIGNATURE}>
                    <a className="btn btn-outlined waves-effect waves-light" style={{ width: "100%" }}>
                      ВЫБРАТЬ
                    </a>
                  </Link>
                </div>
            }
            <div className="row" />
            <div className="col s10">
              <div className="desktoplic_text_item">Сертификаты шифрования:</div>
              <hr />
            </div>
            <div className="col s2">
              <div className="right import-col">
                <a className="btn-floated" data-activates="dropdown-btn-encrypt">
                  <i className="file-setting-item waves-effect material-icons secondary-content">more_vert</i>
                </a>
                <ul id="dropdown-btn-encrypt" className="dropdown-content">
                  <Link to={LOCATION_CERTIFICATE_SELECTION_FOR_ENCRYPT}>
                    <li><a>Добавить</a></li>
                  </Link>
                  <li><a onClick={() => this.handleCleanRecipientsList()}>Очистить</a></li>
                </ul>
              </div>
            </div>
            {
              (recipients && recipients.length) ?
                <div style={{ height: "calc(100vh - 300px)" }}>
                  <div className="add-certs">
                    <RecipientsList recipients={recipients} />
                  </div>
                </div> :
                <div className="col s12">
                  <Link to={LOCATION_CERTIFICATE_SELECTION_FOR_ENCRYPT}>
                    <a className="btn btn-outlined waves-effect waves-light" style={{ width: "100%" }}>
                      ВЫБРАТЬ
                    </a>
                  </Link>
                </div>
            }

            <div className="row fixed-bottom-rightcolumn" >
              <div className="col s12">
                <hr />
              </div>

              <div className="col s4 waves-effect waves-cryptoarm">
                <div className="col s12 svg_icon">
                  <a className={`${this.checkEnableOperationButton(SIGN) ? "" : "disabled_docs"}`}
                    data-position="bottom"
                    onClick={this.handleClickSign}>
                    <i className="material-icons docmenu sign" />
                  </a>
                </div>
                <div className="col s12 svg_icon_text">{localize("Documents.docmenu_sign", locale)}</div>
              </div>

              <div className="col s4 waves-effect waves-cryptoarm">
                <div className="col s12 svg_icon">
                  <a className={`${this.checkEnableOperationButton(VERIFY) ? "" : "disabled_docs"}`}
                    data-position="bottom"
                    data-tooltip={localize("Sign.sign_and_verify", locale)}>
                    <i className="material-icons docmenu verifysign" />

                  </a>
                </div>
                <div className="col s12 svg_icon_text">{"Проверить"}</div>
              </div>

              <div className="col s4 waves-effect waves-cryptoarm">
                <div className="col s12 svg_icon">
                  <a className={`${this.checkEnableOperationButton(UNSIGN) ? "" : "disabled_docs"}`} data-position="bottom">
                    <i className="material-icons docmenu removesign" />
                  </a>
                </div>
                <div className="col s12 svg_icon_text">{localize("Documents.docmenu_removesign", locale)}</div>
              </div>

              <div className="col s12">
                <div className="row halbottom" />
              </div>

              <div className="col s4 waves-effect waves-cryptoarm">
                <div className="col s12 svg_icon">
                  <a className={`${this.checkEnableOperationButton(ENCRYPT) ? "" : "disabled_docs"}`}
                    data-position="bottom"
                    onClick={this.handleClickSign}>
                    <i className="material-icons docmenu encrypt" />
                  </a>
                </div>
                <div className="col s12 svg_icon_text">{localize("Documents.docmenu_enctypt", locale)}</div>
              </div>

              <div className="col s4 waves-effect waves-cryptoarm">
                <div className="col s12 svg_icon">
                  <a className={`${this.checkEnableOperationButton(DECRYPT) ? "" : "disabled_docs"}`}
                    data-position="bottom"
                    data-tooltip={localize("Sign.sign_and_verify", locale)}>
                    <i className="material-icons docmenu decrypt" />
                  </a>
                </div>
                <div className="col s12 svg_icon_text">{localize("Documents.docmenu_dectypt", locale)}</div>
              </div>

              <div className="col s4 waves-effect waves-cryptoarm">
                <div className="col s12 svg_icon">
                  <a className={`${this.checkEnableOperationButton(REMOVE) ? "" : "disabled_docs"}`}
                    data-position="bottom"
                    data-tooltip={localize("Sign.sign_and_verify", locale)}>
                    <i className="material-icons docmenu remove" />
                  </a>
                </div>
                <div className="col s12 svg_icon_text">{localize("Documents.docmenu_remove", locale)}</div>
              </div>

            </div>
          </div>
          {this.showModalFilterDocuments()}
        </div>
      </div>
    );
  }

  getSelectedSigner = () => {
    const { signer } = this.props;
    const { localize, locale } = this.context;

    if (signer) {
      const status = signer.status;
      let curStatusStyle;

      if (status) {
        curStatusStyle = "cert_status_ok";
      } else {
        curStatusStyle = "cert_status_error";
      }

      return (
        <React.Fragment>
          <div className="col s12 valign-wrapper">
            <div className="col s2">
              <div className={curStatusStyle} />
            </div>
            <div className="col s10" style={{ fontSize: "75%" }}>
              <div className="collection-title">{signer.subjectFriendlyName}</div>
              <div className="collection-info cert-info">{signer.issuerFriendlyName}</div>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  handleCleanRecipientsList = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { deleteRecipient, recipients } = this.props;

    recipients.forEach((recipient) => deleteRecipient(recipient.id));
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
    const { activeFilesArr } = this.props;

    if (!activeFilesArr.length) {
      return false;
    }

    switch (operation) {
      case SIGN:
        for (const document of activeFilesArr) {
          if (document.extname === ".enc") {
            return false;
          }
        }

        return true;

      case VERIFY:
      case UNSIGN:
        for (const document of activeFilesArr) {
          if (document.extname !== ".sig") {
            return false;
          }
        }

        return true;

      case ENCRYPT:
        for (const document of activeFilesArr) {
          if (document.extname === ".enc") {
            return false;
          }
        }

        return true;

      case DECRYPT:
        for (const document of activeFilesArr) {
          if (document.extname !== ".enc") {
            return false;
          }
        }

        return true;

      case REMOVE:
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
    activeFilesArr: mapToArr(activeFilesSelector(state, { active: true })),
    files: mapToArr(state.files.entities),
    isDefaultFilters: state.filters.documents.isDefaultFilters,
    recipients: mapToArr(state.recipients.entities)
      .map((recipient) => state.certificates.getIn(["entities", recipient.certId]))
      .filter((recipient) => recipient !== undefined),
    signer: state.certificates.getIn(["entities", state.signers.signer]),
  };
}, { activeFile, deleteFile, deleteRecipient, filePackageSelect, filePackageDelete, selectFile, selectSignerCertificate })(SignatureAndEncryptWindow);
