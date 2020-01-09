import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteRecipient, selectSignerCertificate,
} from "../../AC";
import {
  activeSetting,
} from "../../AC/settingsActions";
import {
  LOCATION_CERTIFICATE_SELECTION_FOR_ENCRYPT, LOCATION_CERTIFICATE_SELECTION_FOR_SIGNATURE,
  REMOVE, SIGN,
} from "../../constants";
import { selectedDocumentsSelector } from "../../selectors/documentsSelector";
import { mapToArr } from "../../utils";
import RecipientsList from "../RecipientsList";
import SignerInfo from "../Signature/SignerInfo";

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
    const { recipients, setting, signer } = this.props;

    return (
      <React.Fragment>
        <div style={{ height: "calc(100vh - 150px)" }}>
          <div className="add-certs">
            <div className="col s10">
              <div className="subtitle">{localize("Sign.signer_cert", locale)}</div>
              <hr />
            </div>
            <div className="col s2">
              <div className="right import-col">
                <a className="btn-floated" data-activates="dropdown-btn-signer">
                  <i className="file-setting-item waves-effect material-icons secondary-content">more_vert</i>
                </a>
                <ul id="dropdown-btn-signer" className="dropdown-content">
                  <Link to={LOCATION_CERTIFICATE_SELECTION_FOR_SIGNATURE}>
                    <li><a onClick={() => {
                      this.props.activeSetting(setting.id);
                    }}>Заменить</a></li>
                  </Link>
                  <li><a onClick={() => this.props.selectSignerCertificate(0)}>{localize("Common.clear", locale)}</a></li>
                </ul>
              </div>
            </div>
            {
              (signer) ? <SignerInfo signer={signer} /> :
                <div className="col s12">
                  <Link to={LOCATION_CERTIFICATE_SELECTION_FOR_SIGNATURE}>
                    <a className="btn btn-outlined waves-effect waves-light" style={{ width: "100%" }}>
                      {localize("Settings.Choose", locale)}
                    </a>
                  </Link>
                </div>
            }

            <div className="row" />

            <div className="col s10">
              <div className="subtitle">Сертификаты шифрования:</div>
              <hr />
            </div>
            <div className="col s2">
              <div className="right import-col">
                <a className="btn-floated" data-activates="dropdown-btn-encrypt">
                  <i className="file-setting-item waves-effect material-icons secondary-content">more_vert</i>
                </a>
                <ul id="dropdown-btn-encrypt" className="dropdown-content">
                  <Link to={LOCATION_CERTIFICATE_SELECTION_FOR_ENCRYPT}>
                    <li><a>{localize("Settings.add", locale)}</a></li>
                  </Link>
                  <li><a onClick={() => this.handleCleanRecipientsList()}>{localize("Common.clear", locale)}</a></li>
                </ul>
              </div>
            </div>
            {
              (recipients && recipients.length) ?
                <div className="col s12">
                  <RecipientsList recipients={recipients} handleRemoveRecipient={(recipient) => this.props.deleteRecipient(recipient.id)} />
                </div> :
                <div className="col s12">
                  <Link to={LOCATION_CERTIFICATE_SELECTION_FOR_ENCRYPT}>
                    <a onClick={() => {
                      this.props.activeSetting(this.props.setting.id);
                    }}
                      className="btn btn-outlined waves-effect waves-light"
                      style={{ width: "100%" }}>
                      {localize("Settings.Choose", locale)}
                    </a>
                  </Link>
                </div>
            }

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
    const { activeDocumentsArr } = this.props;

    if (activeDocumentsArr.length > 0) {
      //
    }
  }

  handleCleanRecipientsList = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { deleteRecipient, recipients } = this.props;

    recipients.forEach((recipient) => deleteRecipient(recipient.id));
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
    recipients: mapToArr(state.settings.getIn(["entities", state.settings.default]).encrypt.recipients)
      .map((recipient) => state.certificates.getIn(["entities", recipient.certId]))
      .filter((recipient) => recipient !== undefined),
    setting: state.settings.getIn(["entities", state.settings.default]),
    settings: state.settings.entities,
    signatures,
    signer: state.certificates.getIn(["entities", state.settings.getIn(["entities", state.settings.default]).sign.signer]),
  };
}, { activeSetting, deleteRecipient, selectSignerCertificate })(DocumentsRightColumn);
