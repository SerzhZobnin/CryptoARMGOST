import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  changeOcspProxyLogin, changeOcspProxyPassword, changeOcspProxyPort, changeOcspProxyUrl,
  changeOcspUrl, changeOcspUseProxy,
} from "../../AC/settingsActions";
import {
  TSP_OCSP_ENABLED,
} from "../../constants";
import LoginForm from "../CA/LoginForm";
import CheckBoxWithLabel from "../CheckBoxWithLabel";

interface IOcspSettingsProps {
  changeOcspUrl: (url: string) => void;
  changeOcspProxyUrl: (url: string) => void;
  changeOcspProxyPort: (port: number) => void;
  changeOcspUseProxy: (use: boolean) => void;
  changeOcspProxyLogin: (login: string) => void;
  changeOcspProxyPassword: (password: string) => void;
  isCades: boolean;
  settings: any;
}

class OcspSettings extends React.Component<IOcspSettingsProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    $(document).on("ready", function() {
      Materialize.updateTextFields();
    });

    try {
      Materialize.updateTextFields();
    } catch (e) {
      //
    }
  }

  componentDidUpdate() {
    try {
      Materialize.updateTextFields();
    } catch (e) {
      //
    }
  }

  render() {
    const { localize, locale } = this.context;
    const { ocsp } = this.props.settings;
    const { url, use_proxy, proxy_url, proxy_login, proxy_password, proxy_port } = ocsp;
    const { isCades } = this.props;

    return (
      <div className="row">
        <div className="input-field col s12">
          <input
            id="url_ocsp"
            disabled={!isCades}
            type="text"
            className="validate"
            name="url_ocsp"
            value={url}
            onChange={this.handleUrlChange}
            placeholder="https://"
          />
          <label htmlFor="url_tsp">
            {localize("Cades.url_ocsp", locale)}
          </label>
        </div>

        {/* <div className="col s12">
          <CheckBoxWithLabel
            disabled={!isCades}
            isChecked={use_proxy}
            elementId="use_proxy_ocsp"
            onClickCheckBox={this.handleUseProxyClick}
            title={localize("Cades.use_proxy", locale)} />
        </div>

        {
          use_proxy && TSP_OCSP_ENABLED ?
            <React.Fragment>
              <div className="input-field col s12">
                <input
                  id="url_proxy_ocsp"
                  disabled={!isCades || !use_proxy}
                  type="text"
                  className="validate"
                  name="url_proxy_ocsp"
                  value={proxy_url}
                  onChange={this.handleUrlProxyChange}
                  placeholder="https://"
                />
                <label htmlFor="url_proxy_ocsp">
                  {localize("Cades.url_proxy", locale)}
                </label>
              </div>

              <div className="input-field col s12">
                <input
                  id="port_ocsp"
                  disabled={!isCades || !use_proxy}
                  type="number"
                  className="validate"
                  max={65536}
                  min={0}
                  name="port_ocsp"
                  value={proxy_port}
                  onChange={this.handleInputPort}
                  placeholder="0 - 65536"
                />
                <label htmlFor="port_ocsp">
                  {localize("Cades.port", locale)}
                </label>
              </div>

              <LoginForm
                disabled={!isCades || !use_proxy}
                login={proxy_login}
                loginChange={this.props.changeOcspProxyLogin}
                password={proxy_password}
                passwordChange={this.props.changeOcspProxyPassword} />
            </ React.Fragment>
            : null
        } */}
      </div>
    );
  }

  handleUrlChange = (ev: any) => {
    // tslint:disable-next-line: no-shadowed-variable
    const { changeOcspUrl } = this.props;

    changeOcspUrl(ev.target.value);
  }

  handleUrlProxyChange = (ev: any) => {
    // tslint:disable-next-line: no-shadowed-variable
    const { changeOcspProxyUrl } = this.props;

    changeOcspProxyUrl(ev.target.value);
  }

  handleInputPort = (ev: any) => {
    // tslint:disable-next-line: no-shadowed-variable
    const { changeOcspProxyPort } = this.props;

    changeOcspProxyPort(parseInt(ev.target.value, 10));
  }

  handleUseProxyClick = () => {
    // tslint:disable-next-line: no-shadowed-variable
    const { changeOcspUseProxy } = this.props;

    changeOcspUseProxy(!this.props.settings.ocsp.use_proxy);
  }
}

export default connect((state) => {
  return {
    settings: state.settings.getIn(["entities", state.settings.active]),
  };
}, {
  changeOcspProxyPort, changeOcspProxyUrl, changeOcspUrl, changeOcspUseProxy,
  changeOcspProxyLogin, changeOcspProxyPassword,
})(OcspSettings);
