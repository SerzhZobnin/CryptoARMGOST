import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import {
  TSP_OCSP_ENABLED,
} from "../../constants";

interface ISignatureStandardSelectorProps {
  value: string;
  disabled?: boolean;
  handleChange: (encoding: string) => void;
}

export const SignatureStandard = {
  CADES: "CAdES-X Long Type 1",
  CMS: "CMS",
};

class SignatureStandardSelector extends React.Component<ISignatureStandardSelectorProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  /**
   * https://github.com/facebook/react/issues/3667
   */
  componentDidMount() {
    $(document).ready(() => {
      $("select").material_select();
    });
    $(ReactDOM.findDOMNode(this.refs.standard)).on("change", this.changeStandard);
  }

  componentDidUpdate() {
    $(document).ready(() => {
      $("select").material_select();
    });
  }

  shouldComponentUpdate(nextProps: any) {
    if (nextProps.disabled !== this.props.disabled ||
      nextProps.value !== this.props.value) {
      return true;
    } else {
      return false;
    }
  }

  changeStandard = (ev: any) => {
    this.props.handleChange(ev.target.value);
  }

  render() {
    const { localize, locale } = this.context;

    const defaultValue = TSP_OCSP_ENABLED ? this.props.value : SignatureStandard.CMS;

    return (
      <div>
        <div className="input-field">
          <select
            className="select"
            disabled={!(TSP_OCSP_ENABLED) || this.props.disabled}
            id="standard"
            ref="standard"
            value={defaultValue}
          >
            <option value={SignatureStandard.CMS}>
              {SignatureStandard.CMS}
            </option>
            <option value={SignatureStandard.CADES}>
              {SignatureStandard.CADES}
            </option>
          </select>
          <label htmlFor="standard">
            {localize("Sign.standard", locale)}
          </label>
        </div>
      </div>
    );
  }
}

export default SignatureStandardSelector;
