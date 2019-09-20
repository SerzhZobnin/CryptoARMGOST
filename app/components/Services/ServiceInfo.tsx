import PropTypes from "prop-types";
import React from "react";

export interface IService {
  name: string;
  url: string;
  field: string;
  login: string;
  password: string;
  email: string;
  key_information: string;
  comment: string;
}

interface IServiceInfoProps {
  service: IService;
}

export default class ServiceInfo extends React.Component<IServiceInfoProps, any> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  render() {
    const { localize, locale } = this.context;
    const { service } = this.props;

    return (
      <React.Fragment>
        <div className="col s10">
          <div className="desktoplic_text_item">{localize("Services.services_connection_options", locale)}</div>
          <hr />
        </div>
        <div className="col s2">
          <div className="right import-col">
            <a className="btn-floated" data-activates="dropdown-btn-settings">
              <i className="file-setting-item waves-effect material-icons secondary-content">more_vert</i>
            </a>
          </div>
        </div>
        <div className="col s12 valign-wrapper">
          <div className="collection cert-info-list">
            <div className="collection-item certs-collection certificate-info">
              <div className={"collection-info cert-info-blue"}>{localize("Services.name", locale)}</div>
              <div className={"collection-title selectable-text"}>{service.name}</div>
            </div>
            <div className="collection-item certs-collection certificate-info">
              <div className={"collection-info cert-info-blue"}>{localize("Services.adress", locale)}</div>
              <div className={"collection-title selectable-text"}>{service.url}</div>
            </div>
          </div>
        </div>
        <div className="row" />

        <div className="col s10">
          <div className="desktoplic_text_item">{localize("Services.services_login_option", locale)}</div>
          <hr />
        </div>
        <div className="col s2">
          <div className="right import-col">
            <a className="btn-floated" data-activates="dropdown-btn-settings">
              <i className="file-setting-item waves-effect material-icons secondary-content">more_vert</i>
            </a>
          </div>
        </div>
        <div className="col s12 valign-wrapper">
          <div className="collection cert-info-list">
            <div className="collection-item certs-collection certificate-info">
              <div className={"collection-info cert-info-blue"}>{localize("Services.login", locale)}</div>
              <div className={"collection-title selectable-text"}>{service.login}</div>
            </div>
            <div className="collection-item certs-collection certificate-info">
              <div className={"collection-info cert-info-blue"}>{localize("Services.password", locale)}</div>
              <div className={"collection-title selectable-text"}>{service.password}</div>
            </div>
          </div>
        </div>
        <div className="row" />

        <div className="col s10">
          <div className="desktoplic_text_item">{localize("Services.services_cert_auth", locale)}</div>
          <hr />
        </div>
        <div className="col s2">
          <div className="right import-col">
            <a className="btn-floated" data-activates="dropdown-btn-settings">
              <i className="file-setting-item waves-effect material-icons secondary-content">more_vert</i>
            </a>
          </div>
        </div>
        <div className="row" />

        <div className="col s10">
          <div className="desktoplic_text_item">{localize("Services.services_user_profile_inf", locale)}</div>
          <hr />
        </div>
        <div className="col s2">
          <div className="right import-col">
            <a className="btn-floated" data-activates="dropdown-btn-settings">
              <i className="file-setting-item waves-effect material-icons secondary-content">more_vert</i>
            </a>
          </div>
        </div>
        <div className="col s12 valign-wrapper">
          <div className="collection cert-info-list">
            <div className="collection-item certs-collection certificate-info">
              <div className={"collection-info cert-info-blue"}>{localize("Services.email", locale)}</div>
              <div className={"collection-title selectable-text"}>{service.email}</div>
            </div>
            <div className="collection-item certs-collection certificate-info">
              <div className={"collection-info cert-info-blue"}>{localize("Services.key_information", locale)}</div>
              <div className={"collection-title selectable-text"}>{service.key_information}</div>
            </div>
            <div className="collection-item certs-collection certificate-info">
              <div className={"collection-info cert-info-blue"}>{localize("Services.comment", locale)}</div>
              <div className={"collection-title selectable-text"}>{service.comment}</div>
            </div>
          </div>
        </div>
        <div className="row" />
      </React.Fragment>
    );
  }
}
