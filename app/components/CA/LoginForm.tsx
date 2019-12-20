import PropTypes from "prop-types";
import React from "react";

interface ILoginFormState {
  passwordIsMasked: boolean;
  remember: boolean;
}

interface ILoginFormProps {
  disabled?: boolean;
  login: string;
  password: string;
  loginChange: (value: string) => void;
  passwordChange: (value: string) => void;
}

class LoginForm extends React.PureComponent<ILoginFormProps, ILoginFormState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: ILoginFormProps) {
    super(props);

    this.state = {
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
    const { passwordIsMasked, remember } = this.state;
    const { disabled, login, password, loginChange, passwordChange } = this.props;

    const isDisabled = !!disabled;

    return (
      <div className="row">
        <div className="row">
          <div className="input-field input-field-csr col s12">
            <input
              disabled={isDisabled}
              id="login"
              type="text"
              className="validate"
              name="login"
              value={login}
              onChange={(ev) => loginChange(ev.target.value)}
            />
            <label htmlFor="login">
              {localize("CA.login", locale)}
            </label>
          </div>
        </div>

        <div className="row">
          <div className="input-field input-field-csr col s11">
            <input
              disabled={isDisabled}
              id="password"
              type={passwordIsMasked ? "password" : "text"}
              className="validate"
              name="password"
              value={password}
              onChange={(ev) => passwordChange(ev.target.value)}
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

        {/* <div className="row">
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
        </div> */}

      </div>
    );
  }

  toggleRemember = () => {
    this.setState({ remember: !this.state.remember });
  }

  togglePasswordMask = () => {
    this.setState({ passwordIsMasked: !this.state.passwordIsMasked });
  }
}

export default LoginForm;
