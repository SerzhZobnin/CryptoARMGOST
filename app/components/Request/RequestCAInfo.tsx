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
          <div className="desktoplic_text_item">{localize("Services.services_connection_options", locale)}</div>
          <hr />
        </div>

        <div className="col s12">
          <div className="collection cert-info-list">
            <div className="collection-item certs-collection certificate-info">
              <div className={"collection-info cert-info-blue"}>{localize("Services.name", locale)}</div>
              <div className={"collection-title selectable-text"}>{requestCA.certificateReq}</div>
            </div>
            <div className="collection-item certs-collection certificate-info">
              <div className={"collection-info cert-info-blue"}>{localize("Services.adress", locale)}</div>
              <div className={"collection-title selectable-text"}>{requestCA.status}</div>
            </div>
          </div>
        </div>
        <div className="row" />

      </React.Fragment>
    );
  }
}
