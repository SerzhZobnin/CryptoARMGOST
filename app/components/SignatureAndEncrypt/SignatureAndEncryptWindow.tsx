import * as fs from "fs";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  activeFile, filePackageDelete, filePackageSelect,
} from "../../AC";
import { activeFilesSelector } from "../../selectors";
import { mapToArr } from "../../utils";
import FilterDocuments from "../Documents/FilterDocuments";
import FileSelector from "../Files/FileSelector";
import Modal from "../Modal";
import SignatureInfoBlock from "../Signature/SignatureInfoBlock";
import SignatureAndEncryptRightColumn from "./SignatureAndEncryptRightColumn";
import {
  TRUSTED_CRYPTO_LOG,
} from "../../constants";
const dialog = window.electron.remote.dialog;

interface ISignatureAndEncryptWindowProps {
  activeFilesArr: any;
  isDefaultFilters: boolean;
  packageSignResult: any;
  signatures: any;
  signedPackage: any;
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

  componentWillReceiveProps(nextProps: ISignatureAndEncryptWindowProps) {
    const { localize, locale } = this.context;
    const { activeFilesArr, signatures } = this.props;

    if (activeFilesArr.length !== nextProps.activeFilesArr.length || signatures.length !== nextProps.signatures.length) {
      if (nextProps.activeFilesArr && nextProps.activeFilesArr.length === 1) {
        if (nextProps.signatures && nextProps.signatures.length) {
          const file = nextProps.activeFilesArr[0];

          const fileSignatures = nextProps.signatures.filter((signature: any) => {
            return signature.fileId === file.id;
          });

          const showSignatureInfo = fileSignatures && fileSignatures.length > 0 ? true : false;

          this.setState({ fileSignatures, file, showSignatureInfo });

          return;
        }
      }
    }

    if (!activeFilesArr || !activeFilesArr.length || !nextProps.activeFilesArr || !nextProps.activeFilesArr.length || nextProps.activeFilesArr.length > 1 || activeFilesArr[0].id !== nextProps.activeFilesArr[0].id) {
      this.setState({ showSignatureInfo: false, signerCertificate: null });
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
    const { fileSignatures, file, showSignatureInfo } = this.state;
    const { isDefaultFilters } = this.props;

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
                    <li><a onClick={this.selectedAll}>{localize("Settings.selected_all", locale)}</a></li>
                    <li><a onClick={this.removeSelectedAll}>{localize("Settings.remove_selected", locale)}</a></li>
                    <li><a onClick={this.removeAllFiles}>{localize("Settings.remove_all_files", locale)}</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <FileSelector operation="SIGN" searchValue={this.state.searchValue} />
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
                    <div className="col s1 offset-s4">
                      <a className="btn btn-text waves-effect waves-light" onClick={this.backView}>
                        {"< НАЗАД"}
                      </a>
                    </div>
                  </div>
                </React.Fragment>
              ) :
              <SignatureAndEncryptRightColumn />
            }

          </div>
          {this.showModalFilterDocuments()}
        </div>
      </div>
    );
  }

  backView = () => {
    this.setState({ showSignatureInfo: false });
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
  let signatures: object[] = [];

  mapToArr(state.signatures.entities).forEach((element: any) => {
    signatures = signatures.concat(mapToArr(element));
  });

  return {
    activeFilesArr: mapToArr(activeFilesSelector(state, { active: true })),
    isDefaultFilters: state.filters.documents.isDefaultFilters,
    files: mapToArr(state.files.entities),
    packageSignResult: state.signatures.packageSignResult,
    signatures,
    signedPackage: state.signatures.signedPackage,
  };
}, { activeFile, filePackageSelect, filePackageDelete })(SignatureAndEncryptWindow);
