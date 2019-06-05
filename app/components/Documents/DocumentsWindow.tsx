import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  activeFile, changeLocation, deleteFile, deleteRecipient,
  filePackageDelete, filePackageSelect, packageSign,
  removeAllFiles, removeAllRemoteFiles, selectFile,
  selectSignerCertificate, verifySignature,
} from "../../AC";
import { documentsReviewed } from "../../AC/documentsActions";
import {
  arhiveDocuments, loadAllDocuments, removeAllDocuments,
  removeDocuments, selectAllDocuments, selectDocument,
} from "../../AC/documentsActions";
import {
  activeSetting,
} from "../../AC/settingsActions";
import {
  DECRYPT, DEFAULT_DOCUMENTS_PATH, ENCRYPT, LOCATION_CERTIFICATE_SELECTION_FOR_ENCRYPT,
  LOCATION_CERTIFICATE_SELECTION_FOR_SIGNATURE, LOCATION_MAIN, LOCATION_SETTINGS_CONFIG,
  REMOVE, SIGN, UNSIGN, USER_NAME, VERIFY,
} from "../../constants";
import { selectedDocumentsSelector } from "../../selectors/documentsSelector";
import { DECRYPTED, ENCRYPTED, ERROR, SIGNED, UPLOADED } from "../../server/constants";
import * as jwt from "../../trusted/jwt";
import { checkLicense } from "../../trusted/jwt";
import * as trustedSign from "../../trusted/sign";
import { dirExists, fileCoding, mapToArr } from "../../utils";
import logger from "../../winstonLogger";
import Modal from "../Modal";
import RecipientsList from "../RecipientsList";
import SignatureInfoBlock from "../Signature/SignatureInfoBlock";
import SignerInfo from "../Signature/SignerInfo";
import DeleteDocuments from "./DeleteDocuments";
import DocumentsTable from "./DocumentsTable";
import FilterDocuments from "./FilterDocuments";

interface IDocumentsWindowProps {
  documents: any;
  documentsLoaded: boolean;
  documentsLoading: boolean;
  isDefaultFilters: boolean;
  changeLocation: (locaion: string) => void;
  loadAllDocuments: () => void;
  filePackageSelect: (files: string[]) => void;
  removeAllDocuments: () => void;
  removeAllFiles: () => void;
  removeAllRemoteFiles: () => void;
  selectAllDocuments: () => void;
  selectDocument: (uid: number) => void;
  removeDocuments: (documents: any) => void;
  arhiveDocuments: (documents: any, arhiveName: string) => void;
}

interface IDocumentsWindowState {
  searchValue: string;
  showModalDeleteDocuments: boolean;
  showModalFilterDocments: boolean;
}

class DocumentsWindow extends React.Component<IDocumentsWindowProps, IDocumentsWindowState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: IDocumentsWindowProps) {
    super(props);

    this.state = {
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

    $(document).ready(function () {
      $(".tooltipped").tooltip();
    });
  }

  componentWillUnmount() {
    $(".tooltipped").tooltip("remove");
  }

  componentWillReceiveProps(nextProps: IDocumentsWindowProps) {
    const { documents, signatures } = this.props;

    if (documents.length !== nextProps.documents.length || signatures.length !== nextProps.signatures.length) {
      if (nextProps.documents && nextProps.documents.length === 1) {
        if (nextProps.signatures && nextProps.signatures.length) {
          const file = nextProps.documents[0];

          const fileSignatures = nextProps.signatures.filter((signature: any) => {
            return signature.fileId === file.id;
          });

          const showSignatureInfo = fileSignatures && fileSignatures.length > 0 ? true : false;

          this.setState({ fileSignatures, file, showSignatureInfo });

          return;
        }
      }
    }

    if (!documents || !documents.length || !nextProps.documents || !nextProps.documents.length || nextProps.documents.length > 1 || documents[0].id !== nextProps.documents[0].id) {
      this.setState({ showSignatureInfo: false, signerCertificate: null });
    }
  }

  render() {
    const { localize, locale } = this.context;
    const { documents, isDefaultFilters, isDocumentsReviewed, recipients, setting, signer } = this.props;
    const { fileSignatures, file, showSignatureInfo } = this.state;

    return (
      <div className="content-noflex">
        <div className="row">
          <div className="col s8 leftcol">
            <div className="row halfbottom">
              <div className="row halfbottom" />
              <div className="col" style={{ width: "40px", paddingLeft: "40px" }}>
                <a >
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
                    <li><a onClick={this.handleReloadDocuments}>{localize("Common.update", locale)}</a></li>
                    <li><a onClick={this.handleSelectAllDocuments}>{localize("Documents.selected_all", locale)}</a></li>
                    <li><a onClick={this.handleOpenDocumentsFolder}>{localize("Documents.go_to_documents_folder", locale)}</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <DocumentsTable searchValue={this.state.searchValue} />
          </div>
          <div className="col s4 rightcol">
            <div className="row halfbottom" />

            {(showSignatureInfo && fileSignatures) ?
              (
                <React.Fragment>
                  <div className="col s12">
                    <div className="desktoplic_text_item">{localize("Sign.sign_info", locale)}</div>
                    <hr />
                  </div>
                  <div style={{ height: "calc(100vh - 100px)" }}>
                    <div className="add-certs">
                      <SignatureInfoBlock
                        signatures={fileSignatures}
                        file={file}
                      />
                    </div>
                  </div>
                  <div className="row fixed-bottom-rightcolumn">
                    <div className="col s1 offset-s12">
                      <a className="btn btn-text waves-effect waves-light" onClick={this.backView}>
                        {"< НАЗАД"}
                      </a>
                    </div>
                  </div>
                </React.Fragment>
              ) :
              <React.Fragment>
                <div className="col s10">
                  <div className="desktoplic_text_item">Настройки:</div>
                  <hr />
                </div>
                <div className="col s2">
                  <div className="right import-col">
                    <a className="btn-floated" data-activates="dropdown-btn-settings">
                      <i className="file-setting-item waves-effect material-icons secondary-content">more_vert</i>
                    </a>
                    <ul id="dropdown-btn-settings" className="dropdown-content">
                      <li><a onClick={() => {
                        this.props.activeSetting(this.props.setting.id);
                        this.props.history.push(LOCATION_SETTINGS_CONFIG);
                      }}>Изменить</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col s12 valign-wrapper">
                  <div className="col s2">
                    <div className="setting" />
                  </div>
                  <div className="col s10" style={{ fontSize: "75%" }}>
                    <div className="collection-title">{setting.name}</div>
                  </div>
                </div>

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
                  (signer) ? <SignerInfo signer={signer} style={{fontSize: "75%"}}/> :
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
                    <div style={{ height: "calc(100vh - 400px)" }}>
                      <div className="add-certs">
                        <RecipientsList recipients={recipients} handleRemoveRecipient={(recipient) => this.props.deleteRecipient(recipient.id)} />
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

                  {
                    documents && documents.length ?
                      <div className="col s12">
                        <div className="input-checkbox">
                          <input
                            name={"filesview"}
                            type="checkbox"
                            id={"filesview"}
                            className="filled-in"
                            checked={isDocumentsReviewed}
                            onClick={this.toggleDocumentsReviewed}
                          />
                          <label htmlFor={"filesview"} className="truncate">
                            {localize("Sign.documents_reviewed", locale)}
                          </label>
                        </div>
                        <div className="row halfbottom" />
                      </div> :
                      null
                  }

                  <div className={`col s4 waves-effect waves-cryptoarm ${this.checkEnableOperationButton(SIGN) ? "" : "disabled_docs"}`} onClick={this.handleClickSign}>
                    <div className="col s12 svg_icon">
                      <a data-position="bottom">
                        <i className="material-icons docmenu sign" />
                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">{localize("Documents.docmenu_sign", locale)}</div>
                  </div>

                  <div className={`col s4 waves-effect waves-cryptoarm  ${this.checkEnableOperationButton(VERIFY) ? "" : "disabled_docs"}`} onClick={this.verifySign}>
                    <div className="col s12 svg_icon">
                      <a data-position="bottom"
                        data-tooltip={localize("Sign.sign_and_verify", locale)}>
                        <i className="material-icons docmenu verifysign" />

                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">{"Проверить"}</div>
                  </div>

                  <div className={`col s4 waves-effect waves-cryptoarm ${this.checkEnableOperationButton(UNSIGN) ? "" : "disabled_docs"}`} onClick={this.unSign}>
                    <div className="col s12 svg_icon">
                      <a data-position="bottom">
                        <i className="material-icons docmenu removesign" />
                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">{localize("Documents.docmenu_removesign", locale)}</div>
                  </div>

                  <div className="col s12">
                    <div className="row halfbottom" />
                  </div>

                  <div className={`col s4 waves-effect waves-cryptoarm ${this.checkEnableOperationButton(ENCRYPT) ? "" : "disabled_docs"}`} onClick={this.encrypt}>
                    <div className="col s12 svg_icon">
                      <a data-position="bottom">
                        <i className="material-icons docmenu encrypt" />
                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">{localize("Documents.docmenu_enctypt", locale)}</div>
                  </div>

                  <div className={`col s4 waves-effect waves-cryptoarm ${this.checkEnableOperationButton(DECRYPT) ? "" : "disabled_docs"}`} onClick={this.decrypt}>
                    <div className="col s12 svg_icon">
                      <a data-position="bottom">
                        <i className="material-icons docmenu decrypt" />
                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">{localize("Documents.docmenu_dectypt", locale)}</div>
                  </div>

                  <div className={`col s4 waves-effect waves-cryptoarm ${this.checkEnableOperationButton(REMOVE) ? "" : "disabled_docs"}`} onClick={this.handleRemoveFiles}>
                    <div className="col s12 svg_icon">
                      <a data-position="bottom"
                        data-tooltip={localize("Sign.sign_and_verify", locale)}>
                        <i className="material-icons docmenu remove" />
                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">{localize("Documents.docmenu_remove", locale)}</div>
                  </div>

                </div>
              </React.Fragment>
            }

          </div>
          {this.showModalFilterDocuments()}
          {this.showModalDeleteDocuments()}
        </div>
      </div>
    );
  }

  backView = () => {
    this.setState({ showSignatureInfo: false });
  }

  toggleDocumentsReviewed = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { documentsReviewed, isDocumentsReviewed } = this.props;

    documentsReviewed(!isDocumentsReviewed);
  }

  handleCleanRecipientsList = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { deleteRecipient, recipients } = this.props;

    recipients.forEach((recipient) => deleteRecipient(recipient.id));
  }

  checkEnableOperationButton = (operation: string) => {
    const { documents, isDocumentsReviewed, signer } = this.props;

    if (!documents.length) {
      return false;
    }

    switch (operation) {
      case SIGN:
        if (!isDocumentsReviewed || !signer) {
          return false;
        } else {
          for (const document of documents) {
            if (document.extension === "enc") {
              return false;
            }
          }
        }

        return true;

      case VERIFY:
      case UNSIGN:
        for (const document of documents) {
          if (document.extension !== "sig") {
            return false;
          }
        }

        return true;

      case ENCRYPT:
        for (const document of documents) {
          if (document.extension === "enc") {
            return false;
          }
        }

        return true;

      case DECRYPT:
        for (const document of documents) {
          if (document.extension !== "enc") {
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

  showModalDeleteDocuments = () => {
    const { localize, locale } = this.context;
    const { documents } = this.props;
    const { showModalDeleteDocuments } = this.state;

    if (!documents || !showModalDeleteDocuments) {
      return;
    }

    return (
      <Modal
        isOpen={showModalDeleteDocuments}
        header={localize("Documents.delete_documents", locale)}
        onClose={this.handleCloseModalDeleteDocuments}>

        <DeleteDocuments
          onCancel={this.handleCloseModalDeleteDocuments}
          removeDocuments={this.handleClickDelete} />
      </Modal>
    );
  }

  handleClickSign = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { documents, filePackageSelect, removeAllFiles, removeAllRemoteFiles } = this.props;
    removeAllFiles();
    removeAllRemoteFiles();
    filePackageSelect(documents);
    this.openWindow(SIGN);
  }

  handleClickEncrypt = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { documents, filePackageSelect, removeAllFiles, removeAllRemoteFiles } = this.props;
    removeAllFiles();
    removeAllRemoteFiles();
    filePackageSelect(documents);
    this.openWindow(ENCRYPT);
  }

  handleClickDelete = () => {
    const { localize, locale } = this.context;
    const { documents } = this.props;
    const count = documents.length;

    removeDocuments(documents);
    this.handleReloadDocuments();

    const message = localize("Documents.documents_deleted1", locale) + count + localize("Documents.documents_deleted2", locale);
    Materialize.toast(message, 2000, "toast-remove_documents");

    this.handleCloseModalDeleteDocuments();
  }

  openWindow = (operation: string) => {
    // tslint:disable-next-line:no-shadowed-variable
    const { changeLocation } = this.props;

    switch (operation) {
      case SIGN:
      case VERIFY:
        changeLocation(LOCATION_MAIN);
        return;

      case ENCRYPT:
      case DECRYPT:
        changeLocation(LOCATION_MAIN);
        return;

      default:
        return;
    }
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

  handleShowModalDeleteDocuments = () => {
    this.setState({ showModalDeleteDocuments: true });
  }

  handleCloseModalDeleteDocuments = () => {
    this.setState({ showModalDeleteDocuments: false });
  }

  handleReloadDocuments = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { documentsLoading, loadAllDocuments, removeAllDocuments } = this.props;
    removeAllDocuments();
    if (!documentsLoading) {
      loadAllDocuments();
    }
  }

  handleArhiveDocuments = () => {
    const { localize, locale } = this.context;
    const { documents } = this.props;
    let arhiveName: string = "";

    const date = new Date();
    // tslint:disable-next-line:quotemark
    // tslint:disable-next-line:max-line-length
    const dateNow = ("0" + date.getDate()).slice(-2) + "." + ("0" + (date.getMonth() + 1)).slice(-2) + "." + date.getFullYear() + "_" + ("0" + date.getHours()).slice(-2) + "." + ("0" + date.getMinutes()).slice(-2) + "." + ("0" + date.getSeconds()).slice(-2);
    arhiveName = "arhive_" + dateNow + ".zip";
    arhiveDocuments(documents, arhiveName);
    this.handleReloadDocuments();
    const message = localize("Documents.documents_arhive", locale) + arhiveName;
    Materialize.toast(message, 2000, "toast-arhive_documents");
  }

  handleSelectAllDocuments = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { selectAllDocuments } = this.props;

    selectAllDocuments();
  }

  handleOpenDocumentsFolder = () => {
    window.electron.shell.openItem(DEFAULT_DOCUMENTS_PATH);
  }
}

export default connect((state) => {
  let signatures: object[] = [];

  mapToArr(state.signatures.entities).forEach((element: any) => {
    signatures = signatures.concat(mapToArr(element));
  });

  return {
    documents: selectedDocumentsSelector(state),
    documentsLoaded: state.events.loaded,
    documentsLoading: state.events.loading,
    isDefaultFilters: state.filters.documents.isDefaultFilters,
    isDocumentsReviewed: state.files.documentsReviewed,
    lic_error: state.license.lic_error,
    recipients: mapToArr(state.settings.getIn(["entities", state.settings.default]).encrypt.recipients)
      .map((recipient) => state.certificates.getIn(["entities", recipient.certId]))
      .filter((recipient) => recipient !== undefined),
    setting: state.settings.getIn(["entities", state.settings.default]),
    signatures,
    signer: state.certificates.getIn(["entities", state.settings.getIn(["entities", state.settings.default]).sign.signer]),
  };
}, {
    arhiveDocuments, activeSetting, changeLocation, deleteRecipient, documentsReviewed,
    filePackageSelect, filePackageDelete, packageSign, loadAllDocuments,
    removeAllDocuments, removeAllFiles, removeAllRemoteFiles, removeDocuments,
    selectAllDocuments, selectDocument, selectSignerCertificate,
  })(DocumentsWindow);
