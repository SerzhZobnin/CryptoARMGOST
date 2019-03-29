import PropTypes from "prop-types";
import React from "react";
import ProductInformation from "./ProductInformation";

class AboutWindow extends React.PureComponent {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  render() {
    const { localize, locale } = this.context;

    return (
      <React.Fragment>
        <div className="about">
          <div className="row card">
            <div className="col s6">
              <ProductInformation />
            </div>
            <div className="col s6">
              <div className="infoapp">
                <div className="card-content gray-text">
                  <span className="card-title">{localize("Help.Help", locale)}</span>
                  <div className="row">
                    <p className="help_paragraf">{localize("Help.user_guide", locale)}
                      <a className="hlink" onClick={(event) => this.gotoLink(localize("Help.link_user_guide", locale))}>
                        {localize("Help.link_user_guide_name", locale)}
                      </a>
                    </p>
                  </div>
                  <p className="help_paragraf">
                    <h6 className="contact-text">{localize("Help.feedback_description", locale)}</h6>
                  </p>
                  <div className="row">
                    <div className="mail-block">
                      <div className="contact-icon"><i className="mail_contact_icon"></i></div>
                      <div className="h6 text-center"><a href="mailto:support@trusted.ru">support@trusted.ru</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  gotoLink = (address: string) => {
    window.electron.shell.openExternal(address);
  }
}

export default AboutWindow;
