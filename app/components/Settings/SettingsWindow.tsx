import PropTypes from "prop-types";
import React from "react";
import {
  LOCATION_SETTINGS_CONFIG,
} from "../../constants";
import SettingsTable from "./SettingsTable";

interface ISettingsWindowState {
  searchValue: string;
  setting: any;
}

class SettingsWindow extends React.Component<{}, ISettingsWindowState> {
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
    const { setting } = this.state;

    return (
      <div className="content-noflex">
        <div className="row">
          <div className="col s8 leftcol">
            <div className="row halfbottom">
              <div className="row halfbottom" />
              <div className="col s12">
                <div className="input-field input-field-csr col s12 border_element find_box">
                  <i className="material-icons prefix">search</i>
                  <input
                    id="search"
                    type="search"
                    placeholder={localize("EventsTable.search_in_table", locale)}
                    value={this.state.searchValue}
                    onChange={this.handleSearchValueChange} />
                  <i className="material-icons close" onClick={() => this.setState({ searchValue: "" })} style={this.state.searchValue ? { color: "#444" } : {}}>close</i>
                </div>
              </div>
              <div className="col s12">
                <SettingsTable searchValue={this.state.searchValue} selectSetting={this.handleSelectSetting} setting={this.state.setting} />
              </div>
            </div>
          </div>
          <div className="col s4 rightcol">
            <div className="row" />
            {
              setting ?
                <div className="row fixed-bottom-rightcolumn" style={{ bottom: "20px" }}>
                  <div className="col s12">
                    <hr />
                  </div>
                  <div className="col s4 waves-effect waves-cryptoarm">
                    <div className="col s12 svg_icon">
                      <a onClick={() => this.props.history.push(LOCATION_SETTINGS_CONFIG)}
                        data-position="bottom">
                        <i className="material-icons certificate export" />
                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">{"Редактирвоать"}</div>
                  </div>

                  <div className="col s4 waves-effect waves-cryptoarm">
                    <div className="col s12 svg_icon">
                      <a data-position="bottom">
                        <i className="material-icons certificate remove" />
                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">{localize("Documents.docmenu_remove", locale)}</div>
                  </div>
                </div>
                : null
            }
          </div>
        </div>
      </div>
    );
  }

  handleSearchValueChange = (ev: any) => {
    this.setState({ searchValue: ev.target.value });
  }

  handleSelectSetting = (setting: any) => {
    this.setState({ setting });
  }
}

export default SettingsWindow;
