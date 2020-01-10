import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  deleteRecipient, packageSign, selectSignerCertificate,
} from "../../AC";
import { documentsReviewed } from "../../AC/documentsActions";
import {
  arhiveDocuments, loadAllDocuments, removeAllDocuments,
  removeDocuments, selectAllDocuments, unselectAllDocuments,
} from "../../AC/documentsActions";
import {
  activeSetting,
} from "../../AC/settingsActions";
import {
  DEFAULT_DOCUMENTS_PATH,
} from "../../constants";
import { selectedDocumentsSelector } from "../../selectors/documentsSelector";
import { mapToArr } from "../../utils";
import Modal from "../Modal";
import DeleteDocuments from "./DeleteDocuments";
import DocumentsRightColumn from "./DocumentsRightColumn";
import DocumentsTable from "./DocumentsTable";
import FilterDocuments from "./FilterDocuments";

interface IDocumentsWindowProps {
  documents: any;
  documentsLoading: boolean;
  isDefaultFilters: boolean;
  loadAllDocuments: () => void;
  removeAllDocuments: () => void;
  selectAllDocuments: () => void;
  removeDocuments: (documents: any) => void;
  arhiveDocuments: (documents: any, arhiveName: string) => void;
  unselectAllDocuments: () => void;
}

interface IDocumentsWindowState {
  packageSignResult: any;
  searchValue: string;
  signatures: any;
  signedPackage: any;
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
    const { localize, locale } = this.context;
    const { documents, signatures } = this.props;

    if (documents.length !== nextProps.documents.length || signatures.length !== nextProps.signatures.length) {
      if (nextProps.documents && nextProps.documents.length) {
        if (nextProps.signatures && nextProps.signatures.length) {
          const file = nextProps.documentsMap.get(nextProps.selectedDocs.last());

          const fileSignatures = nextProps.signatures.filter((signature: any) => {
            return signature.fileId === file.id;
          });

          const showSignatureInfo = fileSignatures && fileSignatures.length > 0 ? true : false;

          this.setState({ fileSignatures, file, showSignatureInfo });

          return;
        }
      }
    }

    if (!documents || !documents.length || !nextProps.documents || !nextProps.documents.length) {
      this.setState({ showSignatureInfo: false });
    }

    if (!this.props.signedPackage && nextProps.signedPackage) {
      if (nextProps.packageSignResult) {
        $(".toast-files_signed").remove();
        Materialize.toast(localize("Sign.files_signed", locale), 2000, "toast-files_signed");
      } else {
        $(".toast-files_signed_failed").remove();
        Materialize.toast(localize("Sign.files_signed_failed", locale), 2000, "toast-files_signed_failed");
      }
    }
  }

  render() {
    const { localize, locale } = this.context;
    const { documents, isDefaultFilters, setting } = this.props;
    const { fileSignatures, file, showSignatureInfo } = this.state;

    const classDefaultFilters = isDefaultFilters ? "filter_off" : "filter_on";

    return (
      <div className="content-noflex">
        <div className="row">
          <div className="col s8 leftcol">
            <div className="row halfbottom">
              <div className="row halfbottom" />
              <div className="col" style={{ width: "calc(100% - 80px)" }}>
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
                  <i className={`file-setting-item waves-effect material-icons secondary-content`}>
                    <i className={`material-icons ${classDefaultFilters}`} />
                  </i>
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
                    <li><a onClick={this.handleUnselectAllDocuments}>{localize("Documents.unselect_all", locale)}</a></li>
                    <li><a onClick={this.handleOpenDocumentsFolder}>{localize("Documents.go_to_documents_folder", locale)}</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={{ height: "calc(100% - 56px)", position: "relative" }}>
              <div>
                <DocumentsTable searchValue={this.state.searchValue} />
              </div>
            </div>
          </div>
          <div className="col s4 rightcol">
            <div className="row halfbottom" />
            <DocumentsRightColumn
              handleClickDelete={this.handleShowModalDeleteDocuments}
              fileSignatures={fileSignatures}
              file={file}
              showSignatureInfo={showSignatureInfo} />
          </div>
          {this.showModalFilterDocuments()}
          {this.showModalDeleteDocuments()}
        </div>
      </div>
    );
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

  handleUnselectAllDocuments = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { unselectAllDocuments } = this.props;

    unselectAllDocuments();
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
    documentsLoading: state.events.loading,
    documentsMap: state.documents.entities,
    isDefaultFilters: state.filters.documents.isDefaultFilters,
    lic_error: state.license.lic_error,
    packageSignResult: state.signatures.packageSignResult,
    selectedDocs: state.documents.selected,
    setting: state.settings.getIn(["entities", state.settings.default]),
    signatures,
    signedPackage: state.signatures.signedPackage,
  };
}, {
  arhiveDocuments, activeSetting, deleteRecipient, documentsReviewed,
  packageSign, loadAllDocuments,
  removeAllDocuments, removeDocuments,
  selectAllDocuments, selectSignerCertificate, unselectAllDocuments,
})(DocumentsWindow);
