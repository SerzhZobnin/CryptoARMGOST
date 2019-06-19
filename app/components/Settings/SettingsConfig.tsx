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
import SignerInfo from "../Signature/SignerInfo";

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
              <div className="row">
                <div className="col s12">
                  <div className="h4">{localize("Settings.general", locale)}</div>
                  <GeneralSettings />
                </div>
              </div>

              <div className="row halfbottom" >
                <div className="col s12">
                  <hr />
                </div>
              </div>

              <div className="col s12">
                <div className="h4">
                  {localize("Sign.sign_setting", locale)}
                </div>

                <SignatureSettings />

                <div className="row nobottom">
                  <div className="col s11">
                    <div className="desktoplic_text_item">{localize("Sign.signer_cert", locale)}</div>
                    <hr />
                  </div>
                  <div className="col s1">
                    <a className="btn-floated" data-activates="dropdown-btn-signer">
                      <i className="file-setting-item waves-effect material-icons secondary-content">more_vert</i>
                    </a>
                    <ul id="dropdown-btn-signer" className="dropdown-content">
                      <Link to={LOCATION_CERTIFICATE_SELECTION_FOR_SIGNATURE}>
                        <li><a>Заменить</a></li>
                      </Link>
                      <li><a onClick={() => this.props.selectSignerCertificate(0)}>{localize("Common.clear", locale)}</a></li>
                    </ul>
                  </div>
                  {
                    (signer) ? <SignerInfo signer={signer} style={{ fontSize: "75%" }} /> :
                      <div className="col s12">
                        <Link to={LOCATION_CERTIFICATE_SELECTION_FOR_SIGNATURE}>
                          <a className="btn btn-outlined waves-effect waves-light" style={{ width: "100%" }}>
                            {localize("Settings.Choose", locale)}
                          </a>
                        </Link>
                      </div>
                  }
                </div>
              </div>

              <div className="row" />

              <div className="row halfbottom" >
                <div className="col s12">
                  <hr />
                </div>
              </div>

              <div className="col s12">
                <div className="h4">{localize("Encrypt.encrypt_setting", locale)}</div>
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
                          <a className="btn btn-outlined waves-effect waves-light" style={{ width: "100%" }}>
                            {localize("Settings.Choose", locale)}
                          </a>
                        </Link>
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="col s4 rightcol">
            <div className="row halfbottom" />
            <div className="row fixed-bottom-rightcolumn">
              <div className="col s1 offset-s4">
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
}

export default connect((state) => {
  return {
    recipients: mapToArr(state.settings.getIn(["entities", state.settings.active]).encrypt.recipients)
      .map((recipient) => state.certificates.getIn(["entities", recipient.certId]))
      .filter((recipient) => recipient !== undefined),
    signer: state.certificates.getIn(["entities", state.settings.getIn(["entities", state.settings.active]).sign.signer]),
  };
}, { deleteRecipient, selectSignerCertificate })(SettingsWindow);
