import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { GOST_28147, GOST_R3412_2015_K, GOST_R3412_2015_M } from "../../constants";

interface IEncryptionAlgorithmSelectorProps {
  EncryptionValue: string;
  disabled?: boolean;
  handleChange: (encoding: string) => void;
}

class EncryptionAlgorithmSelector extends React.Component<IEncryptionAlgorithmSelectorProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  componentDidMount() {
    const self = this;
    $(document).ready(() => {
      $("select").material_select();
    });
    $(ReactDOM.findDOMNode(this.refs.EncryptionAlgorithmSelector)).on("change", self.changeEncryption);
  }

  componentDidUpdate() {
    $(document).ready(() => {
      $("select").material_select();
    });
  }

  changeEncryption = (ev: any) => {
    this.props.handleChange(ev.target.value);
  }

  render() {
    const { localize, locale } = this.context;

    return (
      <div>
        <div className="input-field">
          <select
            className="select"
            disabled={this.props.disabled}
            id="EncryptionAlgorithmSelector"
            ref="EncryptionAlgorithmSelector"
            value={this.props.EncryptionValue}
          >
            <option value={GOST_28147}>{localize("Encrypt.GOST_28147", locale)}</option>
            <option value={GOST_R3412_2015_M}>{localize("Encrypt.GOST_R3412_2015_M", locale)}</option>
            <option value={GOST_R3412_2015_K}>{localize("Encrypt.GOST_R3412_2015_K", locale)}</option>
          </select>
          <label htmlFor="EncryptionAlgorithmSelector">
            {localize("Encrypt.encrypt_alg", locale)}
          </label>
        </div>
      </div>
    );
  }
}

export default EncryptionAlgorithmSelector;
