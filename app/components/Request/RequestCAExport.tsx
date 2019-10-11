import * as fs from "fs";
import PropTypes from "prop-types";
import React from "react";
import { BASE64 } from "../../constants";
import { fileExists } from "../../utils";
import EncodingTypeSelector from "../EncodingTypeSelector";

interface IRequestCAExportState {
  encodingType: string;
}

interface IRequestCAExportProps {
  requestCA: any;
  onSuccess?: () => void;
  onFail?: () => void;
  onCancel?: () => void;
}

const DIALOG = window.electron.remote.dialog;

class RequestCAExport extends React.Component<IRequestCAExportProps, IRequestCAExportState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: IRequestCAExportProps) {
    super(props);

    this.state = ({
      encodingType: BASE64,
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
                {localize("Request.export_request_format_message", locale)}
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

  handleExport = () => {
    const { encodingType } = this.state;
    const { requestCA, onCancel, onFail, onSuccess } = this.props;
    const { localize, locale } = this.context;

    const extension = "csr";

    const outFilePAth = DIALOG.showSaveDialog({
      defaultPath: "export." + extension,
      filters: [{ name: localize("Request.requests", locale), extensions: [extension] }],
      title: localize("Request.export_request", locale),
    });

    const CSR = requestCA.certificateReq;

    if (outFilePAth && CSR) {
      try {
        fs.writeFileSync(outFilePAth, CSR);
      } catch (e) {
        $(".toast-request_export_failed").remove();
        Materialize.toast(localize("Request.request_export_failed", locale), 2000, "toast-request_export_failed");

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

      $(".toast-request_export_ok").remove();
      Materialize.toast(localize("Request.request_export_ok", locale), 2000, "toast-request_export_ok");
    } else {
      if (onCancel) {
        onCancel();
      }

      $(".toast-request_export_cancel").remove();
      Materialize.toast(localize("Request.request_export_cancel", locale), 2000, "toast-request_export_cancel");
    }
  }

  handelCancel = () => {
    const { onCancel } = this.props;
    const { localize, locale } = this.context;

    if (onCancel) {
      onCancel();
    }

    $(".toast-request_export_cancel").remove();
    Materialize.toast(localize("Request.request_export_cancel", locale), 2000, "toast-request_export_cancel");
  }
}

export default RequestCAExport;
