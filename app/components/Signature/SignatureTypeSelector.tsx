import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";

interface ISignatureTypeSelectorProps {
  EncodingValue: string;
  disabled?: boolean;
  handleChange: (encoding: string) => void;
}

const SignatureTypes = {
  ATTACHED: "ATTACHED",
  DETACHED: "DETACHED",
};

class SignatureTypeSelector extends React.Component<ISignatureTypeSelectorProps, {}> {
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
      <div className={"row" + classDisabled}>
        <div className="input-field col s12">
          <select className="select" id="encoding" defaultValue={this.props.EncodingValue}>
            <option value={SignatureTypes.ATTACHED}>
              {SignatureTypes.ATTACHED}
            </option>
            <option value={SignatureTypes.DETACHED}>
              {SignatureTypes.DETACHED}
            </option>
          </select>
          <label>
            {localize("Sign.type_of_signature", locale)}
          </label>
        </div>
      </div>
    );
  }
}

export default SignatureTypeSelector;
