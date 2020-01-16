import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import {
  TSP_OCSP_ENABLED,
} from "../../constants";

interface ISettingsSelectorProps {
  value: string;
  disabled?: boolean;
  handleChange: (encoding: string) => void;
  settings: any;
}

class SettingsSelector extends React.Component<ISettingsSelectorProps, {}> {
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
    $(ReactDOM.findDOMNode(this.refs.settingsSelectRef)).on("change", this.changeStandard);
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
    const { settings, value } = this.props;

    return (
      <div>
        <div className="input-field" style={{ marginTop: "0px" }}>
          <select
            className="select"
            disabled={this.props.disabled}
            id="settingsSelectRef"
            ref="settingsSelectRef"
            value={value}
          >
            {
              settings.map((settingItem: any) => {
                return <option key={settingItem.id} value={settingItem.id}>{settingItem.name}</option>;
              })
            }
          </select>
        </div>
      </div>
    );
  }
}

export default SettingsSelector;
