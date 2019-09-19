import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { changeSearchValue } from "../../AC/searchActions";
import BlockNotElements from "../BlockNotElements";
import BlockWithReference from "../BlockWithReference";

const dialog = window.electron.remote.dialog;

interface IServicesWindowProps {
  isDefaultFilters: boolean;
}

interface IServicesWindowState {
  searchValue: string;
}

class ServicesWindow extends React.Component<IServicesWindowProps, IServicesWindowState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: any) {
    super(props);

    this.state = {
      searchValue: "",
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
    const { isDefaultFilters } = this.props;

    const classDefaultFilters = isDefaultFilters ? "filter_off" : "filter_on";

    return (
      <div className="main">
        <div className="content">
          <div className="col s8 leftcol">
            <div className="row halfbottom">
              <div className="row halfbottom" />
              <div className="col" style={{ width: "40px", paddingLeft: "40px" }}>
                <a>
                  <i className="file-setting-item waves-effect material-icons secondary-content pulse">add</i>
                </a>
              </div>
              <div className="col" style={{ width: "calc(100% - 140px)" }}>
                <div className="input-field input-field-csr col s12 border_element find_box">
                  <i className="material-icons prefix">search</i>
                  <input
                    id="search"
                    type="search"
                    placeholder={localize("EventsTable.search_in_services", locale)}
                    value={this.state.searchValue}
                    onChange={this.handleSearchValueChange} />
                  <i className="material-icons close" onClick={() => this.setState({ searchValue: "" })} style={this.state.searchValue ? { color: "#444" } : {}}>close</i>
                </div>
              </div>
              <div className="col" style={{ width: "40px" }}>
                <a>
                  <i className="file-setting-item waves-effect material-icons secondary-content">autorenew</i>
                </a>
              </div>
              <div className="col" style={{ width: "40px" }}>
                <a>
                  <i className={`file-setting-item waves-effect material-icons secondary-content`}>
                    <i className={`material-icons ${classDefaultFilters}`} />
                  </i>
                </a>
              </div>
            </div>
            <div className="row">
              <div className="col s12">
                <div style={{ display: "flex" }}>
                  <div style={{ flex: "1 1 auto", height: "calc(100vh - 130px)" }}>
                    <BlockWithReference name={"active"} title={localize("Services.services_not_found", locale)} icon={"block"}
                      reference={""} titleRef={localize("Services.services_add_item", locale)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col s4 rightcol">
            <div className="row halfbottom" />
            <div className="row">
              <div className="col s12">
                <div style={{ height: "calc(100vh - 110px)" }}>
                  <BlockNotElements name={"active"} title={localize("Services.services_not_select", locale)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleSearchValueChange = (ev: any) => {
    this.setState({ searchValue: ev.target.value });
  }
}

export default connect((state) => {
  return {
    isDefaultFilters: state.filters.documents.isDefaultFilters,
    searchValue: state.filters.searchValue,
  };
}, { changeSearchValue })(ServicesWindow);
