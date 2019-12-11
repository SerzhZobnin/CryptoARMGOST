import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import {
  LOCATION_CERTIFICATES, LOCATION_CONTAINERS, LOCATION_DOCUMENTS,
  LOCATION_EVENTS, LOCATION_MAIN, LOCATION_SERVICES, LOCATION_SETTINGS,
} from "../constants";

const remote = window.electron.remote;

interface ISideMenu {
  pathname: string;
}

class SideMenu extends React.Component<ISideMenu, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: ISideMenu) {
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
                  <i className="material-icons sidevan my" />
                </div>
                <div className="col s8">
                  Личные
                  </div>
              </div>
            </li>

            <li>
              <div className="row nobottom">
                <div className="col s3">
                  <i className="material-icons sidevan root" />
                </div>
                <div className="col s8">
                  Корневые
                </div>
              </div>
            </li>

            <li>
              <div className="row nobottom">
                <div className="col s3">
                  <i className="material-icons sidevan intermediate" />
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
