import PropTypes from "prop-types";
import React from "react";

interface ILoginFormState {
  login: string;
  password: string;
  passwordIsMasked: boolean;
  remember: boolean;
}

class LoginForm extends React.PureComponent<{}, ILoginFormState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: ILoginFormState) {
    super(props);

    this.state = {
      login: "",
      password: "",
      passwordIsMasked: true,
      remember: true,
    };
  }

  componentDidMount() {
    Materialize.updateTextFields();
  }

  componentDidUpdate() {
    Materialize.updateTextFields();
  }

  render() {
    const { localize, locale } = this.context;
    const { login, password, passwordIsMasked, remember } = this.state;

    return (
      <div className="row">

        <div className="row">
          <div className="input-field input-field-csr col s12">
            <input
              id="login"
              type="text"
              className="validate"
              name="login"
              value={login}
              onChange={this.loginChange}
            />
            <label htmlFor="login">
              {localize("CA.login", locale)}
            </label>
          </div>
        </div>

        <div className="row">
          <div className="input-field input-field-csr col s11">
            <input
              id="password"
              type={passwordIsMasked ? "password" : "text"}
              className="validate"
              name="password"
              value={password}
              onChange={this.passwordChange}
            />
            <label htmlFor="password">
              {localize("CA.password", locale)}
            </label>
          </div>

          <div className="col s1">
            <i className="file-setting-item waves-effect material-icons secondary-content"
              onClick={(event) => {
                event.stopPropagation();
                this.togglePasswordMask();
              }}>visibility</i>
          </div>
        </div>

        <div className="row">
          <div className="col s11">
            <div className="input-checkbox">
              <input
                name="remember"
                type="checkbox"
                id="remember"
                className="filled-in"
                checked={remember}
                onClick={this.toggleRemember}
              />
              <label htmlFor="remember" className="truncate">
                {localize("CA.remember_me", locale)}
              </label>
            </div>
          </div>
        </div>

      </div>
    );
  }

  loginChange = (ev: any) => {
    this.setState({ login: ev.target.value });
  }

  passwordChange = (ev: any) => {
    this.setState({ password: ev.target.value });
  }

  toggleRemember = () => {
    this.setState({ remember: !this.state.remember });
  }

  togglePasswordMask = () => {
    this.setState({ passwordIsMasked: !this.state.passwordIsMasked });
  }
}

export default LoginForm;
