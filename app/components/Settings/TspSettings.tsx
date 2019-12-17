import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  changeTspProxyPort, changeTspProxyUrl, changeTspUrl, changeTspUseProxy,
} from "../../AC/settingsActions";
import CheckBoxWithLabel from "../CheckBoxWithLabel";

interface ITspSettingsProps {
  changeTspUrl: (url: string) => void;
  changeTspProxyUrl: (url: string) => void;
  changeTspProxyPort: (port: number) => void;
  changeTspUseProxy: (use: boolean) => void;
  settings: any;
}

class TspSettings extends React.Component<ITspSettingsProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: any) {
    super(props);
  }

  render() {
    const { localize, locale } = this.context;
    const { tsp } = this.props.settings;

    return (
      <div className="row">
        <div className="input-field col s12">
          <input
            id="url_tsp"
            type="text"
            className="validate"
            name="url_tsp"
            value={tsp.url_tsp}
            onChange={this.handleUrlChange}
            placeholder="https://"
          />
          <label htmlFor="url_tsp">
            {localize("Cades.url_tsp", locale)}
          </label>
        </div>

        <div className="col s12">
          <CheckBoxWithLabel
            disabled={false}
            isChecked={tsp.use_proxy}
            elementId="use_proxy"
            onClickCheckBox={this.handleUseProxyClick}
            title={localize("Cades.use_proxy", locale)} />
        </div>

        <div className="input-field col s12">
          <input
            id="url_proxy"
            type="text"
            className="validate"
            name="url_proxy"
            value={tsp.url_proxy}
            onChange={this.handleUrlProxyChange}
            placeholder="https://"
          />
          <label htmlFor="url_proxy">
            {localize("Cades.url_proxy", locale)}
          </label>
        </div>

        <div className="input-field col s12">
          <input
            id="port"
            type="number"
            className="validate"
            max={65536}
            min={0}
            name="port"
            value={tsp.port}
            onChange={this.handleInputPort}
            placeholder="0 - 65536"
          />
          <label htmlFor="port">
            {localize("Cades.port", locale)}
          </label>
        </div>
      </div>
    );
  }

  handleUrlChange = (ev: any) => {
    // tslint:disable-next-line: no-shadowed-variable
    const { changeTspUrl } = this.props;

    changeTspUrl(ev.target.value);
  }

  handleUrlProxyChange =  (ev: any) => {
    // tslint:disable-next-line: no-shadowed-variable
    const { changeTspProxyUrl } = this.props;

    changeTspProxyUrl(ev.target.value);
  }

  handleInputPort = (ev: any) => {
    // tslint:disable-next-line: no-shadowed-variable
    const { changeTspProxyPort } = this.props;

    changeTspProxyPort(parseInt(ev.target.value, 10));
  }

  handleUseProxyClick = () => {
    // tslint:disable-next-line: no-shadowed-variable
    const { changeTspUseProxy } = this.props;

    changeTspUseProxy(!this.props.settings.tsp.use_proxy);
  }
}

export default connect((state) => {
  return {
    settings: state.settings.getIn(["entities", state.settings.active]),
  };
}, {
  changeTspProxyPort, changeTspProxyUrl, changeTspUrl, changeTspUseProxy,
})(TspSettings);
