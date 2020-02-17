import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";

interface ISettingsSelectorProps {
  value: string;
  disabled?: boolean;
  handleChange: (encoding: string) => void;
  settings: any;
  setting: any;
  showModalAskSaveSetting?: () => void;
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

      setTimeout(() => {
        $(".select-dropdown:eq(0)").css("border-bottom", "none");
        $(".select-dropdown:eq(0)").css("margin", "0");
        $(".select-dropdown:eq(0)").css("height", "2rem");
      }, 0);
    });
    $(ReactDOM.findDOMNode(this.refs.settingsSelectRef)).on("change", this.changeStandard);
  }

  componentDidUpdate() {
    $(document).ready(() => {
      $("select").material_select();

      setTimeout(() => {
        $(".select-dropdown:eq(0)").css("border-bottom", "none");
        $(".select-dropdown:eq(0)").css("margin", "0");
        $(".select-dropdown:eq(0)").css("height", "2rem");
      }, 0);
    });
  }

  shouldComponentUpdate(nextProps: any) {
    if (nextProps.disabled !== this.props.disabled ||
      nextProps.value !== this.props.value ||
      nextProps.setting.savetime !== this.props.setting.savetime ||
      nextProps.setting.changed !== this.props.setting.changed) {
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
    const { setting, settings, value } = this.props;

    const disabled = this.props.disabled || (setting.changed);

    return (
      <div onClick={this.showToast}>
        <div className={`input-field  ${disabled ? "disabled" : ""}`}
          style={{ marginTop: "0px" }}>
          <select
            className="padding-end"
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
          <span
            className="collection-info"
            data-error="wrong"
            data-success="right"
            onClick={() => setTimeout(() => {
              $(".select-dropdown:eq(0)").click();
            }, 0)}
            style={{ cursor: "pointer" }}>
            {`Сохранено: ${setting && setting.savetime ? (new Date(setting.savetime)).toLocaleDateString(locale, {
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              month: "numeric",
              year: "numeric",
            }) : "-"}`}
          </span>
        </div>
      </div>
    );
  }

  showToast = () => {
    const { localize, locale } = this.context;
    const { setting, showModalAskSaveSetting } = this.props;

    if (setting && setting.changed) {
      $(".toast-need_save_settings").remove();
      Materialize.toast(localize("Settings.need_save_settings", locale), 2000, "toast-need_save_settings");

      if (showModalAskSaveSetting) {
        showModalAskSaveSetting();
      }
    }
  }
}

export default SettingsSelector;
