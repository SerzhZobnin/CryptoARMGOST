import PropTypes from "prop-types";
import React from "react";

interface IRequestCADeleteProps {
  deleteRequestCA: (id: string) => void;
  requestCA: any;
  onCancel?: () => void;
}

class RequestCADelete extends React.Component<IRequestCADeleteProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  componentWillUnmount() {
    this.handelCancel();
  }

  render() {
    const { localize, locale } = this.context;

    return (
      <React.Fragment>
        <div className="row halftop">
          <div className="col s12">
            <div className="content-wrapper tbody border_group">
              <div className="col s12">
                <span className="card-infos sub">
                  {localize("Request.realy_delete_request", locale)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="row halfbottom" />

        <div className="row halfbottom">
          <div style={{ float: "right" }}>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className="btn btn-text waves-effect waves-light modal-close" onClick={this.handelCancel}>{localize("Common.cancel", locale)}</a>
            </div>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className="btn btn-outlined waves-effect waves-light modal-close" onClick={this.handleDeleteCrl}>{localize("Common.delete", locale)}</a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  handelCancel = () => {
    const { onCancel } = this.props;

    if (onCancel) {
      onCancel();
    }
  }

  handleDeleteCrl = () => {
    const { deleteRequestCA, requestCA } = this.props;
    const { localize, locale } = this.context;

    if (!requestCA) {
      return;
    }

    deleteRequestCA(requestCA.id);

    $(".toast-request_delete_ok").remove();
    Materialize.toast(localize("Request.request_delete_ok", locale), 2000, "toast-request_delete_ok");

    this.handelCancel();
  }
}

export default RequestCADelete;
