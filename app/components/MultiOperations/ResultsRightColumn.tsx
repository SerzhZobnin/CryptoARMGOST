import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  changeLocation, deleteRecipient, filePackageSelect,
} from "../../AC";
import {
  unselectAllDocuments,
} from "../../AC/documentsActions";
import {
  LOCATION_MAIN, REMOVE, SIGN,
} from "../../constants";
import { originalSelector, selectedOperationsResultsSelector } from "../../selectors/operationsResultsSelector";
import { bytesToSize, mapToArr } from "../../utils";
import FileIcon from "../Files/FileIcon";
import SignatureInfoBlock from "../Signature/SignatureInfoBlock";

interface IDocumentsWindowProps {
  documents: any;
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
    const { documents, entitiesMap, fileSignatures, originalFiles, selectedDocs, showSignatureInfo } = this.props;

    let lastSelectDocument;

    if (selectedDocs && selectedDocs.size) {
      lastSelectDocument = entitiesMap.get(selectedDocs.last());
    }

    return (
      <React.Fragment>
        <div className="col s12">
          <div className="primary-text">{localize("Sign.sign_info", locale)}</div>
          <hr />

          <div className="row">
            <div className="col s10 primary-text">Исходные файлы:</div>
            <div className="col s1" id="rectangle">{originalFiles.length}</div>
            <div className="row halfbottom" />
            <div className="add-cert-collection collection">
              {this.getOriginalFiles()}
            </div>
          </div>
        </div>

        <div className="row fixed-bottom-rightcolumn">

          <div className={`col s8 waves-effect waves-cryptoarm ${this.checkEnableOperationButton(SIGN) ? "" : "disabled_docs"}`} onClick={this.handleClickSign}>
            <div className="col s12 svg_icon">
              <a data-position="bottom">
                <i className="material-icons docmenu send_in_sign_and_encrypt" />
              </a>
            </div>
            <div className="col s12 svg_icon_text">{localize("Documents.open_in_sign_and_encrypt", locale)}</div>
          </div>

          <div className={`col s4 waves-effect waves-cryptoarm ${this.checkEnableOperationButton(REMOVE) ? "" : "disabled_docs"}`} onClick={this.handleClickDelete}>
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
    );
  }

  getOriginalFiles = () => {
    const { localize, locale } = this.context;
    const { entitiesMap, filesMap, originalFiles, operations } = this.props;
    const { selectedOriginalFileIndex } = this.state;

    const elements = originalFiles.map((originalFile: any) => {
      let status = "";
      let icon = "";
      let isValid = "";

      const results = filesMap.get(originalFile.id);
      let flag = true;

      operations.map((value: boolean, key: string) => {
        if (value) {
          const result = results[key];

          if (result) {
            flag = flag && result.result;
          } else {
            flag = false;
          }
        }
      });

      if (flag === true) {
        status = localize("Operations.successful", locale);
        icon = "status_ok_icon";
        isValid = "valid";
      } else {
        status = localize("Operations.failed", locale);
        icon = "status_error_icon";
        isValid = "unvalid";
      }

      const dateSigningTime = new Date();
      dateSigningTime.setHours(dateSigningTime.getHours());

      const active = selectedOriginalFileIndex === originalFile.id ? "active" : "";

      return (
        <div key={originalFile.id} className="row certificate-list-item col s12" id={originalFile.id}>
          <div className={`collection-item avatar certs-collection valign-wrapper ${active}`}
            onClick={() => this.handleSelectOriginalFile(originalFile.id)}>
            <React.Fragment>
              <div className="col s1" style={{ width: "15%" }}>
                <div className={icon} />
              </div>
              <div className="col s11">
                <div className="collection-title">{originalFile.filename}</div>

                <div className={isValid}>{status}</div>

                <div className="collection-info">{localize("Sign.signingTime", locale)}: {originalFile.signingTime ? (new Date(dateSigningTime)).toLocaleString(locale, {
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  month: "long",
                  year: "numeric",
                }) : "-"}
                </div>
              </div>
            </React.Fragment>
          </div>
        </div>
      );
    });

    console.log("elements", elements);

    return elements;
  }

  handleSelectOriginalFile = (index: any) => {
    this.setState({ selectedOriginalFileIndex: index });
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

  handleClickDelete = () => {
    this.props.handleClickDelete();
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
    operations: state.multiOperations.operations,
    originalFiles: mapToArr(originalSelector(state)),
    selectedDocs: state.multiOperations.selected,
    setting: state.settings.getIn(["entities", state.settings.default]),
    settings: state.settings.entities,
    signatures,
  };
}, {
  changeLocation, filePackageSelect, unselectAllDocuments,
})(ResultsRightColumn);
