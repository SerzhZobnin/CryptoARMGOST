import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  changeLocation, deleteRecipient, filePackageSelect, selectSignerCertificate,
} from "../../AC";
import {
  activeSetting,
} from "../../AC/settingsActions";
import {
  LOCATION_MAIN, REMOVE, SIGN,
} from "../../constants";
import { selectedDocumentsSelector } from "../../selectors/documentsSelector";
import { mapToArr } from "../../utils";

interface IDocumentsWindowProps {
  documents: any;
}

class DocumentsRightColumn extends React.Component<IDocumentsWindowProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: IDocumentsWindowProps) {
    super(props);
  }

  componentWillMount() {
    this.props.activeSetting(this.props.setting.id);
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
  }

  render() {
    const { localize, locale } = this.context;

    return (
      <React.Fragment>
        <div style={{ height: "calc(100vh - 150px)" }}>
          <div className="add-certs">

          </div>
        </div>

        <div className="row fixed-bottom-rightcolumn" >
          <div className="col s12">
            <hr />
          </div>

          <div className={`col s4 waves-effect waves-cryptoarm ${this.checkEnableOperationButton(SIGN) ? "" : "disabled_docs"}`} onClick={this.handleClickSign}>
            <div className="col s12 svg_icon">
              <a data-position="bottom">
                <i className="material-icons docmenu sign" />
              </a>
            </div>
            <div className="col s12 svg_icon_text">{localize("Documents.docmenu_sign", locale)}</div>
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
    activeDocumentsArr: selectedDocumentsSelector(state),
    documents: selectedDocumentsSelector(state),
    setting: state.settings.getIn(["entities", state.settings.default]),
    settings: state.settings.entities,
    signatures,
  };
}, {
  activeSetting, changeLocation, deleteRecipient,
  filePackageSelect, selectSignerCertificate,
})(DocumentsRightColumn);
