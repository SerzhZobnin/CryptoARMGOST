import PropTypes, { any } from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { dssAuthIssue } from "../../AC/dssActions";

const login_dss = "login_dss";
const password_dss = "password_dss";

interface IReAuthProps {
  dssUserID: string;
  dssAuthIssue: (user: IUserDSS) => Promise<void>;
  onCancel?: () => void;
}

interface IReAuthState {
  field_value: any;
  user: any;
}

class ReAuth extends React.Component<IReAuthProps, IReAuthState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: IReAuthProps) {
    super(props);

    this.state = ({
      field_value: "",
      user: props.users.get(props.dssUserID),
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

  render() {
    const { localize, locale } = this.context;
    const { field_value, user } = this.state;

    if (!user) {
      this.handleCancel();
    }

    let disabled = "disabled";
    if (field_value[password_dss]) {
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

                  <div className="col s12">
                    <span className="card-infos sub">
                      {localize("DSS.need_reauth", locale)}
                    </span>
                  </div>

                  <div className="row" />

                  <div className="row">
                    <div key={login_dss} className="input-field input-field-csr col s12">
                      <input
                        disabled={true}
                        id={login_dss}
                        type="text"
                        name={login_dss}
                        value={user ? user.login : ""}
                        placeholder={localize("DSS.enter_your_login", locale)}
                      />
                      <label htmlFor={login_dss}>{localize("DSS.login_dss", locale)}</label>
                    </div>
                  </div>

                  <div className="row">
                    <div key={password_dss} className="input-field input-field-csr col s12">
                      <input
                        id={password_dss}
                        type="password"
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

  handleReady = () => {
    const { field_value, user } = this.state;
    // tslint:disable-next-line: no-shadowed-variable
    const { dssAuthIssue } = this.props;

    const userDSS: IUserDSS = {
      authUrl: user.authUrl,
      dssUrl: user.dssUrl,
      id: user.id,
      password: field_value.password_dss,
      user: user.login,
    };

    dssAuthIssue(userDSS);
    this.handleCancel();
  }

  handleCancel = () => {
    const { onCancel } = this.props;

    if (onCancel) {
      onCancel();
    }
  }
}

export default connect((state) => ({
  users: state.users.entities,
}), { dssAuthIssue })(ReAuth);
