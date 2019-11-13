import PropTypes, { any } from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { dssAuthIssue, getCertificatesDSS } from "../../AC/dssActions";
import { md5 } from "../../utils";
import ProgressBars from "../ProgressBars";

const url_oath = "url_oath";
const url_sign = "url_sign";
const login_dss = "login_dss";
const password_dss = "password_dss";

const URL_AUTHORIZATION_USER_DSS = "https://dss.cryptopro.ru/STS/oauth";
const URL_SIGN_SERVER_DSS = "https://dss.cryptopro.ru/SignServer/rest";

interface IDSSConnectionProps {
  dssAuthIssue: (user: IUserDSS) => Promise<void>;
  getCertificatesDSS: (url: string, dssUserID: string,  token: string) => Promise<void>;
  onCancel?: () => void;
  tokensAuth: any;
  isLoaded: boolean;
  isLoading: boolean;
}

interface IDSSConnectionState {
  field_value: any;
  isTestDSS: boolean;
  dssUserID: string;
}

class DSSConnection extends React.Component<IDSSConnectionProps, IDSSConnectionState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: IDSSConnectionProps) {
    super(props);

    this.state = ({
      field_value: "",
      isTestDSS: false,
      dssUserID: "",
    });
  }

  componentDidMount() {
    const self = this;

    $(document).ready(() => {
      $("select").material_select();

      $("select").on("change", self.handleInputChange);
    });

    Materialize.updateTextFields();
  }

  componentDidUpdate(prevProps: IDSSConnectionProps) {
    const { dssUserID, field_value } = this.state;
    // tslint:disable-next-line: no-shadowed-variable
    const { getCertificatesDSS } = this.props;
    const { isLoaded, isLoading } = this.props;

    if (!isLoading && prevProps.isLoading) {
      this.handleCancel();
    }

    const token = this.props.tokensAuth.get(dssUserID);
    const prevToken = prevProps.tokensAuth.get(dssUserID);
    if ((!prevToken && token) || (token && prevToken && token.time !== prevToken.time)) {
      getCertificatesDSS(field_value.url_sign, token.id, token.access_token);
    }
  }

  render() {
    const { localize, locale } = this.context;
    const { field_value, isTestDSS } = this.state;
    const { isLoaded, isLoading } = this.props;

    if (isLoading) {
      return <ProgressBars />;
    }

    let disabled = "disabled";
    if (field_value[url_oath] && field_value[url_sign] && field_value[login_dss] && field_value[password_dss]) {
      disabled = " ";
    }

    return (
      <React.Fragment>

          <div className="row nobottom">
            <div className="col s12 ">
              <div className="row halfbottom" />
              <div className="content-wrapper z-depth-1 tbody">
                <div className="content-item-relative">
                  <div className="row">
                    <div className="row" />
                    <div className="row">
                      <div key={url_oath} className="input-field input-field-csr col s12">
                        <input
                          // disabled={field.ProhibitChange}
                          id={url_oath}
                          type="text"
                          // className={this.validateOidValue(field)}
                          // maxLength={field.Length}
                          name={url_oath}
                          value={field_value[url_oath] ? field_value[url_oath] : ""}
                          onChange={this.handleInputChange}
                          placeholder={`https://`}
                        />
                        <label htmlFor={url_oath}>{localize("DSS.DSS_authorization_server_address", locale)}</label>
                      </div>
                    </div>

                    <div className="row halfbottom">
                      <div key={url_sign} className="input-field input-field-csr col s12">
                        <input
                          // disabled={field.ProhibitChange}
                          id={url_sign}
                          type="text"
                          // className={this.validateOidValue(field)}
                          // maxLength={field.Length}
                          name={url_sign}
                          value={field_value[url_sign] ? field_value[url_sign] : ""}
                          onChange={this.handleInputChange}
                          placeholder={`https://`}
                        />
                        <label htmlFor={url_sign}>{localize("DSS.DSS_server_address", locale)}</label>
                      </div>
                    </div>

                    <div className="row">
                      <div style={{ float: "left" }}>
                        <div style={{ display: "inline-block", margin: "10px" }}>
                          <input
                            name="isTestDSS"
                            className="filled-in"
                            type="checkbox"
                            id="isTestDSS"
                            checked={isTestDSS}
                            onChange={this.toggleIsTestDSS}
                          />
                          <label htmlFor="isTestDSS">
                            {localize("DSS.use_cryptopro_dss_test_service", locale)}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div key={login_dss} className="input-field input-field-csr col s12">
                        <input
                          // disabled={field.ProhibitChange}
                          id={login_dss}
                          type="text"
                          // className={this.validateOidValue(field)}
                          // maxLength={field.Length}
                          name={login_dss}
                          value={field_value[login_dss] ? field_value[login_dss] : ""}
                          onChange={this.handleInputChange}
                          placeholder={localize("DSS.enter_your_login", locale)}
                        />
                        <label htmlFor={login_dss}>{localize("DSS.login_dss", locale)}</label>
                      </div>
                    </div>

                    <div className="row">
                      <div key={password_dss} className="input-field input-field-csr col s12">
                        <input
                          // disabled={field.ProhibitChange}
                          id={password_dss}
                          type="password"
                          // className={this.validateOidValue(field)}
                          // maxLength={field.Length}
                          name={password_dss}
                          value={field_value[password_dss] ? field_value[password_dss] : ""}
                          onChange={this.handleInputChange}
                          placeholder={localize("DSS.enter_your_password", locale)}
                        />
                        <label htmlFor={password_dss}>{localize("DSS.password_dss", locale)}</label>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="row halfbottom" />
            <div className="row halfbottom">
              <div style={{ float: "right" }}>
                <div style={{ display: "inline-block", margin: "10px" }}>
                  <a className="btn btn-text waves-effect waves-light modal-close" onClick={this.handleCancel}>{localize("Common.cancel", locale)}</a>
                </div>
                <div style={{ display: "inline-block", margin: "10px" }}>
                  <a className={`btn btn-outlined waves-effect waves-light ${disabled}`} onClick={this.handleReady}>{localize("Common.ready", locale)}</a>
                </div>
              </div>
            </div>
          </div>
      </React.Fragment>
    );
  }

  handleInputChange = (ev: any) => {
    const target = ev.target;
    const name = target.name;
    const value = ev.target.value;

    const newSubject = {
      ...this.state.field_value,
      [name]: value,
    };

    this.setState(({
      field_value: { ...newSubject },
    }));
  }

  toggleIsTestDSS = () => {
    const { isTestDSS, field_value } = this.state;
    const newSubject = !isTestDSS ?
      { url_oath: URL_AUTHORIZATION_USER_DSS , url_sign: URL_SIGN_SERVER_DSS} : field_value;
    this.setState({
      field_value: { ...newSubject },
      isTestDSS: !isTestDSS,
    });
  }

  handleReady = () => {
    const { field_value } = this.state;
    const { tokensAuth } = this.props;
    // tslint:disable-next-line: no-shadowed-variable
    const { dssAuthIssue } = this.props;

    const dssUserID = md5(field_value.login_dss + field_value.url_oath + field_value.url_sign);
    this.setState({
      dssUserID,
    });

    const userDSS: IUserDSS = {
      authUrl: field_value.url_oath,
      dssUrl: field_value.url_sign,
      id: dssUserID,
      password: field_value.password_dss,
      user: field_value.login_dss,
    };

    dssAuthIssue(userDSS);
  }

  handleCancel = () => {
    const { onCancel } = this.props;

    if (onCancel) {
      onCancel();
    }
  }
}

export default connect((state) => {
  return {
    isLoaded: state.certificatesDSS.loaded,
    isLoading: state.certificatesDSS.loading,
    tokensAuth: state.tokens.tokensAuth,
  };
}, { dssAuthIssue, getCertificatesDSS })(DSSConnection);
