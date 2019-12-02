import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";

interface ISignatureStandardSelectorProps {
  EncodingValue: string;
  disabled?: boolean;
  handleChange: (encoding: string) => void;
}

const SignatureStandard = {
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
    const self = this;
    $(document).ready(() => {
      $("select").material_select();
      $("select").on("change", function () {
        self.changeEncoding($(this)[0].value);
      });
    });
    $(ReactDOM.findDOMNode(this.refs.select)).on("change", this.handleChange);
  }

  changeEncoding = (encoding: string) => {
    this.props.handleChange(encoding);
  }

  render() {
    const { localize, locale } = this.context;
    const classDisabled = this.props.disabled ? "disabled" : "";

    return (
      <div className={classDisabled}>
        <div className="input-field col s12">
          <select className="select" id="encoding" defaultValue={this.props.EncodingValue}>
            <option value={SignatureStandard.CMS}>
              {SignatureStandard.CMS}
            </option>
            <option value={SignatureStandard.CADES}>
              {SignatureStandard.CADES}
            </option>
          </select>
          <label>
            {localize("Sign.standard", locale)}
          </label>
        </div>
      </div>
    );
  }
}

export default SignatureStandardSelector;
