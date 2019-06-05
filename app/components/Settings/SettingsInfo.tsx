import PropTypes from "prop-types";
import React from "react";
import RecipientsList from "../RecipientsList";
import SignerInfo from "../Signature/SignerInfo";

interface ISettingsInfoProps {
  setting: any;
}

export default class SettingsInfo extends React.Component<ISettingsInfoProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  render() {
    const { localize, locale } = this.context;
    const { recipients, setting, signer } = this.props;

    return (
      <div className="add-cert-collection collection cert-info-list">
        <div className="collection-item certs-collection certificate-info">
          <div className="collection-info cert-info-blue">
            {localize("Settings.name", locale)}
          </div>
          <div className="collection-title selectable-text">
            {setting.name}
          </div>
        </div>

        <div className="collection-item certs-collection certificate-info">
          <div className="collection-info cert-info-blue">
            {localize("Documents.save_to_documents", locale)}
          </div>
          <div className="collection-title selectable-text">
            {setting.sign.saveToDocuments ? localize("Common.yes", locale) : localize("Common.no", locale)}
          </div>
        </div>

        <div className="collection-item certs-collection certificate-info">
          <div className="collection-info cert-info-blue">
            {localize("Sign.sign_detached", locale)}
          </div>
          <div className="collection-title selectable-text">
            {setting.sign.detached ? localize("Common.yes", locale) : localize("Common.no", locale)}
          </div>
        </div>

        <div className="collection-item certs-collection certificate-info">
          <div className="collection-info cert-info-blue">
            {localize("Sign.sign_time", locale)}
          </div>
          <div className="collection-title selectable-text">
            {setting.sign.timestamp ? localize("Common.yes", locale) : localize("Common.no", locale)}
          </div>
        </div>

        <div className="collection-item certs-collection certificate-info">
          <div className="collection-info cert-info-blue">
            {"Сертификат подписи:"}
          </div>
          {(signer) ? <SignerInfo signer={signer} style={{fontSize: "90%"}}/> :
            <div className="collection-title selectable-text">
              {localize("Common.no", locale)}
            </div>}
        </div>

        <div className="collection-item certs-collection certificate-info">
          <div className="collection-info cert-info-blue">
            {localize("Encrypt.delete_files_after", locale)}
          </div>
          <div className="collection-title selectable-text">
            {setting.encrypt.delete ? localize("Common.yes", locale) : localize("Common.no", locale)}
          </div>
        </div>

        <div className="collection-item certs-collection certificate-info">
          <div className="collection-info cert-info-blue">
            {localize("Encrypt.archive_files_before", locale)}
          </div>
          <div className="collection-title selectable-text">
            {setting.encrypt.archive ? localize("Common.yes", locale) : localize("Common.no", locale)}
          </div>
        </div>

        <div className="collection-item certs-collection certificate-info">
          <div className="collection-info cert-info-blue">
            {"Сертификаты шифрования:"}
          </div>
          {(recipients && recipients.length) ?
            <div style={{ height: "calc(100vh - 490px)", fontSize: "125%" }}>
              <div className="add-certs">
                <RecipientsList recipients={recipients} />
              </div>
            </div> :
            <div className="collection-title selectable-text">
              {localize("Common.no", locale)}
            </div>}
        </div>
      </div>
    );
  }
}
