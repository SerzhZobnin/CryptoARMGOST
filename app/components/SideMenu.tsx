import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import {
  LOCATION_CERTIFICATES, LOCATION_CONTAINERS, LOCATION_DOCUMENTS,
  LOCATION_EVENTS, LOCATION_MAIN, LOCATION_SERVICES, LOCATION_SETTINGS,
} from "../constants";

const remote = window.electron.remote;

class SideMenu extends React.Component<{}, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  shouldComponentUpdate(nextContext: { locale: string }) {
    return (this.context.locale !== nextContext.locale) ? true : false;
  }

  componentDidMount() {
    $("#certs").dropdown();
  }

  render() {
    const { localize, locale } = this.context;

    return (
      <React.Fragment>
        <div className="menu-logo center-align" style={{ height: "37px" }}>
          <Link to="/" href="/" style={{ height: "37px" }}>
            <i className="material-icons left logo-trusted" style={{ marginTop: "5px" }} />
          </Link>
        </div>

        <div className="row">
          <Link to={LOCATION_MAIN}>
            <i className="material-icons left sign">mode_edit</i>
          </Link>

          <Link to={LOCATION_DOCUMENTS}>
            <i className="material-icons left document">library_books</i>
          </Link>

          <Link id="certs" to={LOCATION_CERTIFICATES} data-activates="dropdown-certificate-stores" data-hover="hover">
            <i className="material-icons left cert">library_books</i>
          </Link>

          <Link to={LOCATION_CONTAINERS}>
            <i className="material-icons left keystore">library_books</i>
          </Link>

          <Link to={LOCATION_SERVICES}>
            <i className="material-icons left dss">library_books</i>
          </Link>

          <Link to={LOCATION_SETTINGS}>
            <i className="material-icons left setting">library_books</i>
          </Link>

          <Link to={LOCATION_EVENTS}>
            <i className="material-icons left journal">help</i>
          </Link>
        </div>
        <div className="row">
          <div className="menu-elements">
            <div className="row">

              <Link to="/about">

                <i className="material-icons left about">about</i>
              </Link>
              <a onClick={() => window.electron.shell.openExternal(localize("Help.link_user_guide", locale))}>

                <i className="material-icons left license">license</i>
              </a>
              <Link to="/" onClick={() => {
                remote.getGlobal("sharedObject").isQuiting = true;
                remote.getCurrentWindow().close();
              }}>

                <i className="material-icons left exit">exit_to_app</i>
              </Link>
            </div>
          </div>
        </div>
        <div>
          <ul id="dropdown-certificate-stores" className="dropdown-content">
            <li>
              <div className="center-align">
                <a style={{ fontWeight: "bold", color: "#bf3817" }}>Сертификаты</a>
              </div>
            </li>
            <li>
              <div className="row nobottom">
                <div className="col s3">
                  <i className="material-icons left my" />
                </div>
                <div className="col s8">
                  Личные
                  </div>
              </div>
            </li>

            <li>
              <div className="row nobottom">
                <div className="col s3">
                  <i className="material-icons left root" />
                </div>
                <div className="col s8">
                  Корневые
                </div>
              </div>
            </li>

            <li>
              <div className="row nobottom">
                <div className="col s3">
                  <i className="material-icons left intermediate" />
                </div>
                <div className="col s8">
                  Промежуточные
                  </div>
              </div>
            </li>
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

export default SideMenu;
