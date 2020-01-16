import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
  applySettings, changeDefaultSettings, createSettings,
} from "../../AC/settingsActions";

interface ICertificateDeleteState {
  name: string;
}

interface ISaveSettingsProps {
  onCancel?: () => void;
}

class SaveSettings extends React.Component<ISaveSettingsProps, ICertificateDeleteState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: ISaveSettingsProps) {
    super(props);

    this.state = ({
      name: "",
    });
  }

  componentDidMount() {
    Materialize.updateTextFields();
  }

  componentWillUnmount() {
    this.handelCancel();
  }

  render() {
    const { localize, locale } = this.context;
    const { name } = this.state;

    let disabled = "";

    if (!name) {
      disabled = "disabled";
    }

    return (
      <React.Fragment>
        <div className="row">
          <div className="row halfbottom" />
          <div className="input-field col s12">
            <input
              id="name"
              type="text"
              className="validate"
              name="name"
              value={name}
              placeholder={localize("Settings.save_placeholder", locale)}
              onChange={this.handleNameChange}
            />
            <label htmlFor="name">
              {localize("Settings.settings_name", locale)}
            </label>
          </div>
        </div>

        <div className="row halfbottom">
          <div style={{ float: "right" }}>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className="btn btn-text waves-effect waves-light modal-close" onClick={this.handelCancel}>{localize("Common.cancel", locale)}</a>
            </div>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className={`btn btn-outlined waves-effect waves-light modal-close ${disabled}`} onClick={this.handelSave}>{localize("Common.save", locale)}</a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleNameChange = (ev: any) => {
    this.setState({ name: ev.target.value });
  }

  handelCancel = () => {
    const { onCancel } = this.props;

    if (onCancel) {
      onCancel();
    }
  }

  handelSave = () => {
    const { setting } = this.props;
    const { name } = this.state;

    this.props.createSettings(name, setting);

    this.handelCancel();
  }
}

export default connect((state) => {
  const setting = state.settings.getIn(["entities", state.settings.active]);

  return {
    setting,
  };
}, { applySettings, changeDefaultSettings, createSettings })(SaveSettings);
