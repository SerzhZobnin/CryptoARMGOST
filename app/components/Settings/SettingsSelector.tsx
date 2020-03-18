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
    $(".SettingsSelector").dropdown();
  }

  componentDidUpdate() {
    $(".SettingsSelector").dropdown();
  }

  shouldComponentUpdate(nextProps: any) {
    if (nextProps.disabled !== this.props.disabled ||
      nextProps.value !== this.props.value ||
      nextProps.setting.savetime !== this.props.setting.savetime ||
      nextProps.setting.changed !== this.props.setting.changed ||
      nextProps.setting !== this.props.setting) {
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
      <div>
      <a className="SettingsSelector" data-activates="SettingsSelector-settings" >
      Expand me
      </a>
      <ul id="SettingsSelector-settings" className="dropdown-content" style= {{ }}>
        {
                this.getElements(settings)
        }
       </ul>
    </div>
    );
  }
 
  getElements=(settingsElements: any)=>{
    const elements: any[] = [];

    settingsElements.map((settingItem: any) => {
      elements.push( <li><div className="row">
        <div className="col s10">
          <div className="collection-title">{settingItem.name}</div>
          </div>
          <div className="col s10">
          <div className="collection-title">{settingItem.name}</div>
          </div>
                 

      </div>
        </li>)
      

    });

    return elements;
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
