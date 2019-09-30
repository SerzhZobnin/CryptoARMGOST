import PropTypes from "prop-types";
import React from "react";

interface IRequestCAInfoProps {
  requestCA: any;
}

export default class RequestCAInfo extends React.Component<IRequestCAInfoProps, any> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  render() {
    const { localize, locale } = this.context;
    const { requestCA } = this.props;

    return (
      <React.Fragment>
        <div className="col s12">
          <div className="desktoplic_text_item">{localize("CA.request_status", locale)}</div>
          <hr />
        </div>

        <div className="col s12">
          <div className="collection cert-info-list">
            <div className="collection-item certs-collection certificate-info">
              <div className={"collection-info cert-info-blue"}>{localize("CA.current_status", locale)}</div>
              <div className={"collection-title selectable-text"}>{requestCA.status}</div>
            </div>
          </div>
        </div>

        <div className="row" />

        <div className="col s12">
          <div className="desktoplic_text_item">{localize("CA.request_info", locale)}</div>
          <hr />
        </div>
      </React.Fragment>
    );
  }
}
