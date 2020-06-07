import PropTypes from "prop-types";
import React from "react";

interface IWrongCertificateProps {
  onCancel?: () => void;
  onContinue: () => void;
  message: any;
}

const remote = window.electron.remote;

class WrongCertificate extends React.Component<IWrongCertificateProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  componentWillUnmount() {
    const { onCancel } = this.props;

    if (onCancel) {
      onCancel();
    }
  }

  render() {
    const { localize, locale } = this.context;
    const { message } = this.props;

    return (
      <React.Fragment>
        <div className="row halftop">
          <div className="col s12">
            <div className="content-wrapper tbody border_group">
              <div className="col s12">
                <span className="card-infos sub">
                  {
                    message
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="row halfbottom" />

        <div className="row halfbottom">
          <div style={{ float: "right" }}>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className="btn btn-text waves-effect waves-light modal-close" onClick={this.handelCancel}>
                {localize("Common.cancel", locale)}
              </a>
            </div>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className="btn btn-outlined waves-effect waves-light" onClick={this.handelContinue}>{localize("Common.continue", locale)}</a>
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

  handelContinue = () => {
    this.props.onContinue();
  }
}

export default WrongCertificate;
