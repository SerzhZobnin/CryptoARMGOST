import PropTypes from "prop-types";
import React from "react";
import CheckBoxWithLabel from "../CheckBoxWithLabel";

interface IOcspSettingsProps {
  handleChange: (encoding: string) => void;
}

class OcspSettings extends React.Component<IOcspSettingsProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  render() {
    const { localize, locale } = this.context;

    return (
      <div className="row">
        <div className="col s12 m12 l6">
          <div className="input-field col s12">
            <input
              id="url_ocsp"
              type="text"
              className="validate"
              name="url_ocsp"
              value={""}
              onChange={this.handleInputChange}
              placeholder="https://"
            />
            <label htmlFor="url_tsp">
              {localize("Cades.url_ocsp", locale)}
            </label>
          </div>

          <div className="col s12">
            <CheckBoxWithLabel
              disabled={false}
              elementId="saveToDocuments"
              title={localize("Cades.use_proxy", locale)} />
            <div className="row" />
          </div>
        </div>

        <div className="col s12 m12 l6">
          <div className="input-field col s12">
            <input
              id="url_proxy"
              type="text"
              className="validate"
              name="url_proxy"
              value={""}
              onChange={this.handleInputChange}
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
              name="port"
              value={""}
              onChange={this.handleInputChange}
              placeholder="0 - 65536"
            />
            <label htmlFor="port">
              {localize("Cades.port", locale)}
            </label>
          </div>
        </div>
      </div>
    );
  }

  handleInputChange = (ev: any) => {
    console.log(ev);
  }
}

export default OcspSettings;
