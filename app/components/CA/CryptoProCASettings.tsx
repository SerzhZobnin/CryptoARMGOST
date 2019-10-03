import PropTypes from "prop-types";
import React from "react";
import { IService } from "../Services/types";

interface ICryptoProCASettingsProps {
  urlChange: (ev: any) => void;
  nameChange: (ev: any) => void;
  service: IService;
  comment: string;
  commentChange: (ev: any) => void;
  description: string;
  descriptionChange: (ev: any) => void;
  email: string;
  emailChange: (ev: any) => void;
  keyPhrase: string;
  keyPhraseChange: (ev: any) => void;
  regNewUser: boolean;
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
    const { comment, commentChange, description, descriptionChange,
      email, emailChange, keyPhrase, keyPhraseChange,
      urlChange, nameChange, regNewUser, service } = this.props;

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
              className="validate"
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

        <div className="row" />

        <div className="row">
          <div className="input-field input-field-csr col s12">
            <input
              id="auth"
              type="text"
              className="validate"
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

        <div className="row" />

        {regNewUser ?
          <React.Fragment>
            <div className="row">
              <div className="input-field input-field-csr col s12">
                <input
                  id="comment"
                  type="text"
                  className="validate"
                  name="comment"
                  value={comment}
                  placeholder={localize("CA.comment", locale)}
                  onChange={commentChange}
                />
                <label htmlFor="comment">
                  {localize("CA.comment", locale)}
                </label>
              </div>
            </div>

            <div className="row" />

            <div className="row">
              <div className="input-field input-field-csr col s12">
                <input
                  id="description"
                  type="text"
                  className="validate"
                  name="description"
                  value={description}
                  placeholder={localize("CA.description", locale)}
                  onChange={descriptionChange}
                />
                <label htmlFor="description">
                  {localize("CA.description", locale)}
                </label>
              </div>
            </div>

            <div className="row" />

            <div className="row">
              <div className="input-field input-field-csr col s12">
                <input
                  id="email"
                  type="email"
                  className="validate"
                  name="email"
                  value={email}
                  placeholder={localize("CA.email", locale)}
                  onChange={emailChange}
                />
                <label htmlFor="email">
                  {localize("CA.email", locale)}
                </label>
              </div>
            </div>

            <div className="row" />

            <div className="row">
              <div className="input-field input-field-csr col s12">
                <input
                  id="keyPhrase"
                  type="text"
                  className="validate"
                  maxLength={1024}
                  name="keyPhrase"
                  value={keyPhrase}
                  placeholder={localize("CA.keyPhrase", locale)}
                  onChange={keyPhraseChange}
                />
                <label htmlFor="keyPhrase">
                  {localize("CA.keyPhrase", locale)}
                </label>
              </div>
            </div>
          </React.Fragment> :
          null
        }
      </div>
    );
  }
}

export default CryptoProCASettings;
