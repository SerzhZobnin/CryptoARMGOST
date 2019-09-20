import PropTypes from "prop-types";
import React from "react";
import { IService } from "../Services/types";

interface ICryptoProCASettingsProps {
  urlChange: (ev: any) => void;
  nameChange: (ev: any) => void;
  service: IService;
}

class CryptoProCASettings extends React.PureComponent<ICryptoProCASettingsProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  componentDidMount() {
    Materialize.updateTextFields();
  }

  componentDidUpdate() {
    Materialize.updateTextFields();
  }

  render() {
    const { localize, locale } = this.context;
    const { urlChange, nameChange, service } = this.props;

    if (!service) {
      return null;
    }

    const { settings } = service;
    const url = settings && settings.url ? settings.url : "";
    const name = service.name;

    return (
      <div className="row">
        <div className="row" />
        <div className="row">
          <div className="input-field input-field-csr col s12">
            <input
              id="name"
              type="text"
              className={"validate"}
              name="name"
              value={name}
              placeholder={localize("Services.write_service_description", locale)}
              onChange={nameChange}
            />
            <label htmlFor="name">
              {localize("Services.description", locale)}
            </label>
          </div>
        </div>
        <div className="row">
          <div className="row" />
          <div className="row">
            <div className="input-field input-field-csr col s12">
              <input
                id="auth"
                type="text"
                className={"validate"}
                name="auth"
                value={url}
                placeholder={localize("CA.url_placeholder", locale)}
                onChange={urlChange}
              />
              <label htmlFor="auth">
                {localize("CA.url", locale)}
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CryptoProCASettings;
