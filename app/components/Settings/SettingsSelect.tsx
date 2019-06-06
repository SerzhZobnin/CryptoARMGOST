import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  deleteRecipient,
} from "../../AC";
import {
  activeSetting, changeDefaultSettings, createSettings,
  deleteSetting,
} from "../../AC/settingsActions";
import {
  LOCATION_SETTINGS_CONFIG,
} from "../../constants";
import { mapToArr } from "../../utils";
import BlockNotElements from "../BlockNotElements";
import SettingsInfo from "./SettingsInfo";
import SettingsTable from "./SettingsTable";

interface ISettingsSelectState {
  searchValue: string;
  setting: any;
}

class SettingsSelect extends React.Component<{}, ISettingsSelectState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: {}) {
    super(props);

    this.state = {
      searchValue: "",
      setting: null,
      showModalFilterEvents: false,
    };
  }

  componentDidMount() {
    $(".btn-floated, .nav-small-btn").dropdown({
      alignment: "left",
      belowOrigin: false,
      gutter: 0,
      inDuration: 300,
      outDuration: 225,
    });
  }

  render() {
    const { localize, locale } = this.context;
    const { recipients, setting, settings, signer } = this.props;

    return (
      <div className="content-noflex">
        <div className="row">
          <div className="col s8 leftcol">
            <div className="row halfbottom">
              <div className="row halfbottom" />
              <div className="col s12">
                <SettingsTable searchValue={this.state.searchValue} selectSetting={this.handleSelectSetting} setting={setting} />
              </div>
            </div>
          </div>
          <div className="col s4 rightcol">
            <div className="row" />
            {
              setting ?
                <React.Fragment>
                  <SettingsInfo setting={setting} signer={signer} recipients={recipients} handleRemoveRecipient={(recipient) => this.props.deleteRecipient(recipient.id)} />
                  <div className="row fixed-bottom-rightcolumn" style={{ bottom: "20px" }}>
                    <div className="col s5 offset-s5">
                      <a className="btn btn-text waves-effect waves-light" onClick={this.props.history.goBack}>
                        ОТМЕНА
                      </a>
                    </div>
                    <div className="col s2">
                      <a className="btn btn-outlined waves-effect waves-light" onClick={ this.handleApplySetting}>
                        {localize("Settings.Choose", locale)}
                      </a>
                    </div>
                  </div>
                </React.Fragment>
                :
                <BlockNotElements name={"active"} title={localize("Settings.setting_not_select", locale)} />
            }
          </div>
        </div>
      </div>
    );
  }

  handleSearchValueChange = (ev: any) => {
    this.setState({ searchValue: ev.target.value });
  }

  handleSelectSetting = (setting) => {
    const { settings } = this.props;
    if (settings && settings.active !== setting.id) {
      this.props.activeSetting(setting.id);
    } else {
      this.props.activeSetting(null);
    }
  }

  handleApplySetting = () => {
    const { setting } = this.props;

    if (setting) {
      console.log("--- setting", setting);
      this.props.changeDefaultSettings(setting.id);
    }

    this.props.history.goBack();
  }
}

export default connect((state) => {
  const setting = state.settings.getIn(["entities", state.settings.active]);

  return {
    recipients: setting ? mapToArr(setting.encrypt.recipients)
      .map((recipient) => state.certificates.getIn(["entities", recipient.certId]))
      .filter((recipient) => recipient !== undefined) : [],
    setting: setting,
    settings: state.settings,
    signer: setting ? state.certificates.getIn(["entities", setting.sign.signer]) : "",
  };
}, { activeSetting, changeDefaultSettings, createSettings, deleteRecipient, deleteSetting })(SettingsSelect);
