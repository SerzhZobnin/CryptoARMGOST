import PropTypes from "prop-types";
import React from "react";
import { localizeAlgorithm } from "../../i18n/localize";
import CertificateChainInfo from "../Certificate/CertificateChainInfo";

interface ISignatureStatusProps {
  signature: any;
  handleActiveCert: (cert: any) => void;
}

class SignatureStatus extends React.Component<ISignatureStatusProps, any> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  handleClick = () => {
    const { signature, handleActiveCert } = this.props;

    handleActiveCert(signature.certs[0]);
  }

  render() {
    const { signature } = this.props;
    const { localize, locale } = this.context;

    let status = "";
    let icon = "";
    let isValid = "";

    if (signature.status_verify === true) {
      status = localize("Sign.sign_ok", locale);
      icon = "status_ok_icon";
      isValid = "valid";
    } else {
      status = localize("Sign.sign_error", locale);
      icon = "status_error_icon";
      isValid = "unvalid";
    }

    const signerCert = signature.certs[signature.certs.length - 1];

    let dateSigningTime = new Date(signature.signingTime);
    dateSigningTime.setHours(dateSigningTime.getHours() + 3)

    return (
      <div className="row halfbottom" onClick={this.handleClick}>
        <div className="col s12 collection">
          <div className="caption-text">{localize("Certificate.subject", locale)}</div>
          <div className="collection-title">{signerCert.subjectFriendlyName}</div>
        </div>

        <div className="col s12 collection">
          <div className="caption-text">{localize("Certificate.issuer", locale)}</div>
          <div className="collection-title">{signerCert.issuerFriendlyName}</div>
          <div className="caption-text">{localize("Certificate.cert_valid", locale)}</div>
          <div className="collection-title">{(new Date(signerCert.notAfter)).toLocaleDateString(locale, {
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            month: "long",
            year: "numeric",
          })}</div>
          <div className="caption-text">{localize("Sign.alg", locale)}</div>
          <div className="collection-title">{localizeAlgorithm(signature.alg, locale)}</div>
        </div>

        <div className="col s12">
          <a className="caption-text">{localize("Certificate.cert_chain_info", locale)}</a>
          <CertificateChainInfo certificate={signerCert} style="" onClick={() => { return; }} />
        </div>

        <div className="row halfbottom" />

        <div className="col s2" style={{ width: "11%" }}>
          <div className={icon} />
        </div>
        <div className="col s10 ">
          <div className="col s12">
            <div className={isValid}>{status}</div>

            <div className="collection-info">{localize("Sign.signingTime", locale)}: {signature.signingTime ? (new Date(dateSigningTime)).toLocaleString(locale, {
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              month: "long",
              year: "numeric",
            }) : "-"}</div>
          </div>
        </div>

        <div className="col s12">
          <hr />
        </div>
      </div>
    );
  }
}

export default SignatureStatus;
