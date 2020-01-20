import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  resetSettingChanges, saveSettings,
} from "../../AC/settingsActions";

interface IAskSaveSettingProps {
  isOnExit?: boolean;
  onCancel?: () => void;
  resetSettingChanges: () => void;
  saveSettings: () => void;
}

const remote = window.electron.remote;

class AskSaveSetting extends React.Component<IAskSaveSettingProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  componentWillUnmount() {
    this.handelCancel();
  }

  render() {
    const { localize, locale } = this.context;
    const { isOnExit } = this.props;

    return (
      <React.Fragment>
        <div className="row halftop">
          <div className="col s12">
            <div className="content-wrapper tbody border_group">
              <div className="col s12">
                <span className="card-infos sub">
                  {
                    isOnExit ?
                      "У вас есть несохранённые изменения. Сохранить их перед выходом из приложения?"
                      :
                      "У вас есть несохранённые изменения. Перед выбором других параметов сбросьте изменения или сохраните их"
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="row halfbottom" />

        <div className="row halfbottom">
          <div style={{ float: "right" }}>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className="btn btn-text waves-effect waves-light modal-close" onClick={this.handelDontSave}>
                {isOnExit ? localize("Common.dont_save", locale) : localize("Common.reset", locale)}
              </a>
            </div>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className={`btn btn-outlined waves-effect waves-light modal-close`} onClick={this.handelSave}>{localize("Common.save", locale)}</a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  handelCancel = () => {
    const { onCancel, isOnExit } = this.props;

    if (onCancel) {
      onCancel();
    }

    if (isOnExit) {
      remote.getGlobal("sharedObject").isQuiting = true;
      remote.getCurrentWindow().close();
    }
  }

  handelDontSave = () => {
    this.props.resetSettingChanges();

    this.handelCancel();
  }

  handelSave = () => {
    this.props.saveSettings();

    this.handelCancel();
  }
}

export default connect((state) => {
  const setting = state.settings.getIn(["entities", state.settings.active]);

  return {
    setting,
  };
}, { resetSettingChanges, saveSettings })(AskSaveSetting);
