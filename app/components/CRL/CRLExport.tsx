import * as fs from "fs";
import PropTypes from "prop-types";
import React from "react";
import { BASE64, DER } from "../../constants";
import { fileExists } from "../../utils";

interface ICRLExportState {
  encodingType: string;
}

interface ICRLExportProps {
  crl: any;
  onSuccess?: () => void;
  onFail?: () => void;
  onCancel?: () => void;
}

const DIALOG = window.electron.remote.dialog;

class CRLExport extends React.Component<ICRLExportProps, ICRLExportState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: ICRLExportProps) {
    super(props);

    this.state = ({
      encodingType: DER,
    });
  }

  render() {
    const { localize, locale } = this.context;

    return (
      <div className="row halftop">
        <div className="col s12">
          <div className="content-wrapper tbody border_group">
            <div className="row">
              <div className="col s12">
                <span className="card-infos sub">
                  {this.getMessage()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="row halfbottom">
          <div style={{ float: "right" }}>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className={"btn btn-text waves-effect waves-light modal-close "} onClick={this.handelCancel}>{localize("Common.cancel", locale)}</a>
            </div>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className={"btn btn-outlined waves-effect waves-light modal-close"} onClick={this.handleExport}>{localize("Export.export", locale)}</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getMessage = (): string => {
    const { encodingType } = this.state;
    const { localize, locale } = this.context;

    return localize("Export.export_format", locale) + ": "
      + (encodingType === BASE64 ? localize("Export.export_crl_format_base64", locale) : localize("Export.export_crl_format_der", locale));
  }

  handleEncodingChange = (encoding: string) => {
    this.setState({ encodingType: encoding });
  }

  handleExport = () => {
    const { encodingType } = this.state;
    const { crl, onCancel, onFail, onSuccess } = this.props;
    const { localize, locale } = this.context;

    const extension = "crl";

    const outFilePAth = DIALOG.showSaveDialog({
      defaultPath: "export." + extension,
      filters: [{ name: localize("CRL.crls", locale), extensions: [extension] }],
      title: localize("CRL.export_crl", locale),
    });

    const X509_CRL = window.PKISTORE.getPkiObject(crl);

    if (!X509_CRL) {
      $(".toast-crl_export_failed").remove();
      Materialize.toast(localize("CRL.crl_export_failed", locale), 2000, "toast-crl_export_failed");

      if (onCancel) {
        onCancel();
      }

      return;
    }

    if (outFilePAth && X509_CRL) {
      try {
        X509_CRL.save(outFilePAth);
      } catch (e) {
        $(".toast-crl_export_failed").remove();
        Materialize.toast(localize("CRL.crl_export_failed", locale), 2000, "toast-crl_export_failed");

        if (fileExists(outFilePAth)) {
          fs.unlinkSync(outFilePAth);
        }

        if (onFail) {
          onFail();
        }

        return;
      }

      if (onSuccess) {
        onSuccess();
      }

      $(".toast-crl_export_ok").remove();
      Materialize.toast(localize("CRL.crl_export_ok", locale), 2000, "toast-crl_export_ok");
    } else {
      if (onCancel) {
        onCancel();
      }

      $(".toast-crl_export_cancel").remove();
      Materialize.toast(localize("CRL.crl_export_cancel", locale), 2000, "toast-crl_export_cancel");
    }
  }

  handelCancel = () => {
    const { onCancel } = this.props;
    const { localize, locale } = this.context;

    if (onCancel) {
      onCancel();
    }

    $(".toast-crl_export_cancel").remove();
    Materialize.toast(localize("CRL.crl_export_cancel", locale), 2000, "toast-crl_export_cancel");
  }
}

export default CRLExport;
