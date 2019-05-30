import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteRecipient, selectSignerCertificate,
} from "../../AC";
import {
  LOCATION_CERTIFICATE_SELECTION_FOR_ENCRYPT,
  LOCATION_CERTIFICATE_SELECTION_FOR_SIGNATURE,
} from "../../constants";
import { mapToArr } from "../../utils";
import EncryptSettings from "../Encrypt/EncryptSettings";
import RecipientsList from "../RecipientsList";
import SignatureSettings from "../Signature/SignatureSettings";
import GeneralSettings from "./GeneralSettings";

interface ISettingsWindowState {
  showModalLicenseCSPSetup: boolean;
  showModalLicenseSetup: boolean;
}

class SettingsWindow extends React.Component<{}, ISettingsWindowState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: {}) {
    super(props);
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
    const { recipients, signer } = this.props;

    return (
      <div className="content-noflex">
        <div className="row">
          <div className="col s8 leftcol">
            <div className="row halfbottom">
              <div className="row halfbottom" />
              <div className="col s12">
                <div className="desktoplic_text_item">{localize("Settings.general", locale)}</div>
                <hr />
                <GeneralSettings />
              </div>

              <div className="row" />

              <div className="col s12">
                <div className="desktoplic_text_item">{localize("Sign.sign_setting", locale)}</div>
                <hr />
                <SignatureSettings />
                <div className="col s12">
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
                </div>
              </div>

              <div className="row" />

              <div className="col s12">
                <div className="desktoplic_text_item">{localize("Encrypt.encrypt_setting", locale)}</div>
                <hr />
                <EncryptSettings />

                <div className="row" />

                <div className="col s12">
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
                      <div>
                        <RecipientsList recipients={recipients} />
                      </div> :
                      <div className="col s12">
                        <Link to={LOCATION_CERTIFICATE_SELECTION_FOR_ENCRYPT}>
                          <a className="btn btn-outlined waves-effect waves-light" style={{ width: "100%" }}>
                            ВЫБРАТЬ
                        </a>
                        </Link>
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="col s4 rightcol">
            <div className="row" />
            <div className="row fixed-bottom-rightcolumn">
              <div className="col s1 offset-s12">
                <a className="btn btn-text waves-effect waves-light" onClick={this.props.history.goBack}>
                  {"< НАЗАД"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleCleanRecipientsList = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { deleteRecipient, recipients } = this.props;

    recipients.forEach((recipient) => deleteRecipient(recipient.id));
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
}

export default connect((state) => {
  return {
    recipients: mapToArr(state.recipients.entities)
      .map((recipient) => state.certificates.getIn(["entities", recipient.certId]))
      .filter((recipient) => recipient !== undefined),
    signer: state.certificates.getIn(["entities", state.settings.getIn(["entities", state.settings.default]).sign.signer]),
  };
}, { deleteRecipient, selectSignerCertificate })(SettingsWindow);
