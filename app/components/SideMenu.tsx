import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  LOCATION_CERTIFICATES, LOCATION_CONTAINERS, LOCATION_DOCUMENTS,
  LOCATION_EVENTS, LOCATION_MAIN, LOCATION_SERVICES, LOCATION_SETTINGS, LOCATION_LICENSE,
} from "../constants";
import { filteredCertificatesSelector } from "../selectors";
import { filteredCrlsSelector } from "../selectors/crlsSelectors";
import { filteredRequestCASelector } from "../selectors/requestCASelector";

const remote = window.electron.remote;

interface ISideMenuProps {
  certificates: any;
  certrequests: any;
  crls: any;
  pathname: string;
}

class SideMenu extends React.Component<ISideMenuProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: ISideMenuProps) {
    super(props);
  }

  componentDidMount() {
    $("#certs").dropdown();
  }

  render() {
    const { localize, locale } = this.context;
    const { pathname } = this.props;

    return (
      <React.Fragment>
        <div className="menu-logo center-align" style={{ height: "37px" }}>
          <Link to="/" href="/" style={{ height: "37px" }}>
            <i className="material-icons left logo-trusted" style={{ marginTop: "5px" }} />
          </Link>
        </div>

        <div className="row">
          <div className="row nobottom">
            {LOCATION_MAIN === pathname ? < div className="side-nav-rectangle" /> : null}
            <Link to={LOCATION_MAIN} style={{ padding: "0 10px" }}>
              <i className="material-icons sidevan sign">mode_edit</i>
            </Link>
          </div>

          <div className="row nobottom">
            {LOCATION_DOCUMENTS === pathname ? < div className="side-nav-rectangle" /> : null}
            <Link to={LOCATION_DOCUMENTS} style={{ padding: "0 10px" }}>
              <i className="material-icons sidevan document"></i>
            </Link>
          </div>

          <div className="row nobottom">
            {LOCATION_CERTIFICATES === pathname ? < div className="side-nav-rectangle" /> : null}
            <Link id="certs" to={LOCATION_CERTIFICATES} data-activates="dropdown-certificate-stores" data-hover="hover" style={{ padding: "0 10px" }}>
              <i className="material-icons sidevan cert"></i>
            </Link>
          </div>

          <div className="row nobottom">
            {LOCATION_CONTAINERS === pathname ? < div className="side-nav-rectangle" /> : null}
            <Link to={LOCATION_CONTAINERS} style={{ padding: "0 10px" }}>
              <i className="material-icons sidevan keystore"></i>
            </Link>
          </div>

          <div className="row nobottom">
            {LOCATION_SERVICES === pathname ? < div className="side-nav-rectangle" /> : null}
            <Link to={LOCATION_SERVICES} style={{ padding: "0 10px" }}>
              <i className="material-icons sidevan dss"></i>
            </Link>
          </div>

          <div className="row nobottom">
            {LOCATION_SETTINGS === pathname ? < div className="side-nav-rectangle" /> : null}
            <Link to={LOCATION_SETTINGS} style={{ padding: "0 10px" }}>
              <i className="material-icons sidevan setting"></i>
            </Link>
          </div>

          <div className="row nobottom">
            {LOCATION_EVENTS === pathname ? < div className="side-nav-rectangle" /> : null}
            <Link to={LOCATION_EVENTS} style={{ padding: "0 10px" }}>
              <i className="material-icons sidevan journal">help</i>
            </Link>
          </div>

        </div>
        <div className="row">
          <div className="menu-elements">
            <div className="row">
              <div className="row nobottom">
                {"/about" === pathname ? < div className="side-nav-rectangle" /> : null}
                <Link to="/about" style={{ padding: "0 10px" }}>
                  <i className="material-icons sidevan about" style={{ padding: "0 10px" }}>about</i>
                </Link>
              </div>
              <a onClick={() => window.electron.shell.openExternal(localize("Help.link_user_guide", locale))} style={{ padding: "0 10px" }}>
                <i className="material-icons sidevan license">license</i>
              </a>
              <Link to="/" onClick={() => {
                remote.getGlobal("sharedObject").isQuiting = true;
                remote.getCurrentWindow().close();
              }} style={{ padding: "0 10px" }}>

                <i className="material-icons sidevan exit">exit_to_app</i>
              </Link>
            </div>
          </div>
        </div>
        {this.getStoresMenu()}
      </React.Fragment>
    );
  }

  getStoresMenu = () => {
    const { certificates, crls, certrequests } = this.props;
    const { localize, locale } = this.context;

    const my: object[] = [];
    const root: object[] = [];
    const intermediate: object[] = [];
    const other: object[] = [];
    const token: object[] = [];
    const request: object[] = [];

    certificates.forEach((cert: any) => {
      switch (cert.category) {
        case "MY":
          return my.push(cert);
        case "ROOT":
          return root.push(cert);
        case "CA":
          return intermediate.push(cert);
        case "AddressBook":
          return other.push(cert);
        case "TOKEN":
          return token.push(cert);
        case "Request":
          return request.push(cert);
      }
    });

    certrequests.forEach((csr: any) => {
      return request.push(csr);
    });

    return (
      <div>
        <ul id="dropdown-certificate-stores" className="dropdown-content" style={{ minHeight: "36px", height: "36px" }}>
          <li>
            <div className="center-align">
              <a style={{ fontWeight: "bold", color: "#bf3817" }}>СЕРТИФИКАТЫ</a>
            </div>
          </li>
          {this.getStoresMenuElement(localize("Certificate.sidesubmenu_my", locale), localize("Certificate.certs_my", locale), "my", my)}
          {this.getStoresMenuElement(localize("Certificate.sidesubmenu_other", locale), localize("Certificate.certs_other", locale), "other", other)}
          {this.getStoresMenuElement(localize("Certificate.sidesubmenu_intermediate", locale), localize("Certificate.certs_intermediate", locale), "intermediate", intermediate)}
          {this.getStoresMenuElement(localize("Certificate.sidesubmenu_root", locale), localize("Certificate.certs_root", locale), "root", root)}
          {this.getStoresMenuElement(localize("Certificate.sidesubmenu_token", locale), localize("Certificate.certs_token", locale), "token", token)}
          {this.getStoresMenuElement(localize("Certificate.sidesubmenu_request", locale), localize("Certificate.certs_request", locale), "request", request)}
          {this.getStoresMenuElement(localize("Certificate.sidesubmenu_crls", locale), localize("Certificate.crls", locale), "crl", crls)}
          <li onClick={() => $("#certs").dropdown("close")}>
            <Link to={LOCATION_CONTAINERS} style={{ height: "33px", padding: "0px" }}>
              <div className="row nobottom valign-wrapper">
                <div className="col" style={{ width: "36px" }}>
                  <i className="material-icons left container" />
                </div>
                <div className="col">
                  {localize("Certificate.sidesubmenu_keys", locale)}
                </div>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    );
  }

  getStoresMenuElement = (head: string, menuBarHead: string, name: string, elements: object[]) => {
    if (elements && elements.length) {
      return (
        <li onClick={() => $("#certs").dropdown("close")}>
          <Link to={{ pathname: LOCATION_CERTIFICATES, search: name, state: { head: menuBarHead } }} style={{ height: "33px", padding: "0px" }}>
            <div className="row nobottom valign-wrapper">
              <div className="col" style={{ width: "36px" }}>
                <i className={`material-icons left ${name}`} />
              </div>
              <div className="col ">
                {head}
              </div>
            </div>
          </Link>
        </li >
      );
    } else {
      return null;
    }
  }
}

export default connect((state) => {
  return {
    certificates: filteredCertificatesSelector(state, { operation: "certificate" }),
    certrequests: filteredRequestCASelector(state),
    crls: filteredCrlsSelector(state),
    isLoaded: state.certificates.loaded,
    isLoading: state.certificates.loading,
    services: state.services,
  };
})(SideMenu);
