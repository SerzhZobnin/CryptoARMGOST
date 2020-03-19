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
      <div  className="subtitle 1" >     <i className="material-icons right" style = {{ margin: "10px 0px 0px 0px" }}>arrow_drop_down</i>
        <div className="SettingsSelector" data-activates="SettingsSelector-settings" >
            { 
            this.props.setting.name 
            } 
            <br/><span style= {{fontSize: "75%"}}>
            {`Сохранено: ${setting && setting.savetime ? (new Date(setting.savetime)).toLocaleDateString(locale, {
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              month: "numeric",
              year: "numeric",
            }) : "-"}`
            }</span>

          
        </div>
        
          <ul id="SettingsSelector-settings" className="dropdown-content " >
           {
                this.getElements(settings)
           }
       </ul>
    </div>
    
    );
  }
 
  getElements=(settingsElements: any)=>{
    const { localize, locale } = this.context;
    const elements: any[] = [];
    
    settingsElements.map((settingItem: any) => {
      elements.push( <li   onClick={
        ()=>this.props.handleChange(settingItem.id)} ><div className="" >
        <div style= {{marginLeft: "20px"}}>
          <div >{settingItem.name}</div>
          </div>
          <div>
          <div style= {{marginLeft: "20px", fontSize: "75%"}}>
            { 
           `Сохранено: ${ settingItem.savetime ? (new Date(settingItem.savetime)).toLocaleDateString(locale, {
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            month: "numeric",
            year: "numeric",
          }) : "-"}`

            }</div>
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
