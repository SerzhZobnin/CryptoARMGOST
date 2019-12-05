import PropTypes from "prop-types";
import React from "react";
import { ITimestamp } from "../../reducer/signatures";

interface ITimestampInfoProps {
  timestamp: ITimestamp;
}

class TimestampInfo extends React.Component<ITimestampInfoProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: ITimestampInfoProps) {
    super(props);
  }

  render() {
    const { timestamp } = this.props;
    const { localize, locale } = this.context;

    const status = this.verifyCertificate(timestamp.TSACertificate);
    let curStatusStyle;

    if (status) {
      curStatusStyle = "cert_status_ok";
    } else {
      curStatusStyle = "cert_status_error";
    }

    return (
      <div className="row halfbottom" >
        <div className="col s12 primary-text">{localize("Tsp.tsp_properties", locale)}:</div>
        <div className="col s12">
          <div className="collection">
            <div className="collection-item certs-collection certificate-info">
              <div className="collection-title selectable-text">{timestamp.SerialNumber.toString("hex")}</div>
              <div className="collection-info">{localize("Tsp.serial_number", locale)}</div>
            </div>

            <div className="collection-item certs-collection certificate-info">
              <div className="collection-title selectable-text">{(new Date(timestamp.Time)).toLocaleDateString(locale, {
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                month: "long",
                year: "numeric",
              })}</div>
              <div className="collection-info">{localize("Tsp.time", locale)}</div>
            </div>

            <div className="collection-item certs-collection certificate-info">
              <div className="collection-title selectable-text">{timestamp.PolicyID}</div>
              <div className="collection-info">{localize("Tsp.policy_id", locale)}</div>
            </div>
          </div>
        </div>

        <div className="col s12 primary-text">{localize("Tsp.tsa_certificate", locale)}:</div>
        <div className="col s12 valign-wrapper">
          <div className="col s2">
            <div className={curStatusStyle} />
          </div>
          <div className="col s10">
            <div className="collection-title selectable-text">{timestamp.TSACertificate.subjectFriendlyName}</div>
            <div className="collection-info">{timestamp.TSACertificate.issuerFriendlyName}</div>
          </div>
        </div>

        <div className="col s12">
          <div className="collection">
            <div className="collection-item certs-collection certificate-info">
              <div className="collection-title selectable-text">{timestamp.TSACertificate.serialNumber}</div>
              <div className="collection-info">{localize("Certificate.serialNumber", locale)}</div>
            </div>

            <div className="collection-item certs-collection certificate-info">
              <div className="collection-title">{(new Date(timestamp.TSACertificate.notAfter)).toLocaleDateString(locale, {
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                month: "long",
                year: "numeric",
              })}</div>
              <div className="collection-info">{localize("Certificate.cert_valid", locale)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  verifyCertificate = (certificate: trusted.pki.Certificate) => {
    const { localize, locale } = this.context;
    const { timestamp } = this.props;

    try {
      const res = timestamp.TSP.VerifyCertificate(certificate);

      if (res === 0) {
        return true;
      } else {
        $(".toast-error_verify_certificate").remove();
        Materialize.toast(`${localize("Tsp.error_verify_certificate", locale)}: ${res}`, 3000, "toast-error_verify_certificate");

        return false;
      }
    } catch (e) {
      $(".toast-error_verify_certificate").remove();
      Materialize.toast(`${localize("Tsp.error_verify_certificate", locale)} ${e}`, 3000, "toast-error_verify_certificate");
    }

    return false;
  }
}

export default TimestampInfo;
