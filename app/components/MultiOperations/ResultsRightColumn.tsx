import * as fs from "fs";
import { Map } from "immutable";
import * as path from "path";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  changeLocation, filePackageSelect,
} from "../../AC";
import {
  unselectAllDocuments,
} from "../../AC/documentsActions";
import {
  DEFAULT_DOCUMENTS_PATH, LOCATION_MAIN, REMOVE, SIGN,
} from "../../constants";
import { originalSelector, selectedOperationsResultsSelector } from "../../selectors/operationsResultsSelector";
import { fileExists, mapToArr } from "../../utils";

interface IDocumentsWindowProps {
  documents: any;
  results: any;
  unselectAllDocuments: () => void;
}

interface IDocumentsWindowState {
  selectedOriginalFileIndex: number;
}

class ResultsRightColumn extends React.Component<IDocumentsWindowProps, IDocumentsWindowState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: IDocumentsWindowProps) {
    super(props);

    this.state = {
      selectedOriginalFileIndex: 0,
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

    $(".collapsible").collapsible();
  }

  componentWillUnmount() {
    $(".tooltipped").tooltip("remove");

    this.props.unselectAllDocuments();
  }

  render() {
    const { localize, locale } = this.context;
    const { documents, entitiesMap, fileSignatures, isPerformed,
      originalFiles, selectedDocs, showSignatureInfo, status } = this.props;

    let lastSelectDocument;

    if (selectedDocs && selectedDocs.size) {
      lastSelectDocument = entitiesMap.get(selectedDocs.last());
    }

    let isValid = "";

    if (status) {
      isValid = "valid";
    } else {
      isValid = "unvalid";
    }

    return (
      <React.Fragment>
        <div style={{ height: `calc(100vh - 180px)` }}>
          <div style={{ height: "100%", overflow: "auto" }}>
            {
              isPerformed ?
                <React.Fragment>
                  <div className="col s12">
                    <div className="primary-text">{localize("Operations.status", locale)}</div>
                    <hr />
                  </div>

                  <div className="col s6">
                    <div className={isValid}>{status ? "Успех" : "Ошибка"}</div>
                  </div>

                  <div className="row halfbottom" />
                </React.Fragment>
                :
                null
            }

            <div className="col s12">
              <div className="primary-text">{localize("Events.operations_log", locale)}</div>
              <hr />
            </div>

            <div className="row">
              <div className="add-cert-collection collection">
                {this.getResults()}
              </div>
            </div>
          </div>
        </div>

        <div className="row fixed-bottom-rightcolumn">
          <div className="col s12">
            <hr />
          </div>

          <div className={`col s6 waves-effect waves-cryptoarm ${this.checkEnableOperationButton(SIGN) ? "" : "disabled_docs"}`} onClick={this.handleClickSign}>
            <div className="col s12 svg_icon">
              <a data-position="bottom">
                <i className="material-icons docmenu send_in_sign_and_encrypt" />
              </a>
            </div>
            <div className="col s12 svg_icon_text">{localize("Documents.open_in_sign_and_encrypt", locale)}</div>
          </div>

          <div className={`col s5 waves-effect waves-cryptoarm ${this.checkEnableOperationButton(REMOVE) ? "" : "disabled_docs"}`} onClick={this.handleSaveCopy}>
            <div className="col s12 svg_icon">
              <a data-position="bottom"
                data-tooltip={localize("Sign.sign_and_verify", locale)}>
                <i className="material-icons docmenu journal" />
              </a>
            </div>
            <div className="col s12 svg_icon_text">{localize("Operations.save_copy_to_documents", locale)}</div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  getResults = () => {
    const { localize, locale } = this.context;
    const { results } = this.props;

    const elements = results.map((value: any) => {
      let icon = "";

      if (value.result) {
        icon = "status_ok_icon";
      } else {
        icon = "status_error_icon";
      }

      let inFiles = "";
      let outFiles = "-";

      if (value.in && Array.isArray(value.in)) {
        value.in.forEach((fileProps: any) => {
          inFiles += `${fileProps.filename}; `;
        });
      } else {
        inFiles = value.in.filename;
      }

      if (value.out && value.out.operation === 2 && value.out.unzipedFiles && Array.isArray(value.out.unzipedFiles)) {
        value.out.unzipedFiles.forEach((fileProps: any) => {
          outFiles += `${fileProps.filename}; `;
        });
      } else if (value.out && value.out.filename) {
        outFiles = value.out.filename;
      }

      return (
        <div className={"collection-item avatar certs-collection valign-wrapper"} style={{ paddingTop: "5px", paddingBottom: "5px" }} >
          <div className="col s1" style={{ width: "15%" }}>
            <div className={icon} />
          </div>
          <div className="col s10">
            <div className="collection-title">{localize(`Operations.${value.operation}`, locale)}</div>
            <div className="collection-info">{inFiles}</div>
            <div className="collection-info">-> {outFiles}</div>
          </div>
        </div>
      );
    });

    return elements;
  }

  handleClickSign = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { changeLocation, documents, filePackageSelect } = this.props;
    filePackageSelect(documents);
    changeLocation(LOCATION_MAIN);
  }

  checkEnableOperationButton = (operation: string) => {
    const { documents } = this.props;

    if (!documents.length) {

      return false;
    }

    switch (operation) {
      case SIGN:
        return true;

      case REMOVE:

        return true;

      default:

        return false;
    }
  }

  handleSaveCopy = () => {
    const { documents } = this.props;

    documents.forEach((doc: any) => {
      const newFileUri = path.join(DEFAULT_DOCUMENTS_PATH, path.basename(doc.fullpath));

      if (!fileExists(newFileUri)) {
        fs.copyFileSync(doc.fullpath, newFileUri);
      }
    });

    $(".toast-cert_import_failed").remove();
    Materialize.toast("Файлы скопированы в Документы", 2000, "toast-cert_import_failed");
  }
}

export default connect((state) => {
  let signatures: object[] = [];

  mapToArr(state.signatures.entities).forEach((element: any) => {
    signatures = signatures.concat(mapToArr(element));
  });

  return {
    activeDocumentsArr: selectedOperationsResultsSelector(state),
    documents: selectedOperationsResultsSelector(state),
    entitiesMap: state.multiOperations.entities,
    filesMap: state.multiOperations.files,
    isPerformed: state.multiOperations.performed,
    operations: state.multiOperations.operations,
    originalFiles: mapToArr(originalSelector(state)),
    results: state.multiOperations.results,
    selectedDocs: state.multiOperations.selected,
    setting: state.settings.getIn(["entities", state.settings.default]),
    settings: state.settings.entities,
    signatures,
    status: state.multiOperations.status,
  };
}, {
  changeLocation, filePackageSelect, unselectAllDocuments,
})(ResultsRightColumn);
