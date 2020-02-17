import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { changeSearchValue } from "../../AC/searchActions";
import ProgressBars from "../ProgressBars";
import FileTableSmall from "./FileTableSmall";

class ResultsWindow extends React.Component<any, any> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: any) {
    super(props);
  }

  render() {
    const { isPerforming, searchValue } = this.props;
    const { localize, locale } = this.context;

    if (isPerforming) {
      return <ProgressBars />;
    }

    return (
      <div className="content-noflex">
        <div className="row">
          <div className="col s8 leftcol">
            <div className="row halfbottom">
              <div className="row halfbottom" />
              <div className="col" style={{ width: "calc(100% - 60px)" }}>
                <div className="input-field input-field-csr col s12 border_element find_box">
                  <i className="material-icons prefix">search</i>
                  <input
                    id="search"
                    type="search"
                    placeholder={localize("Certificate.search_in_certificates_list", locale)}
                    value={searchValue}
                    onChange={this.handleSearchValueChange} />
                  <i className="material-icons close" onClick={() => this.props.changeSearchValue("")} style={this.props.searchValue ? { color: "#444" } : {}}>close</i>
                </div>
              </div>
            </div>
            <div className="collection">
              <div style={{ flex: "1 1 auto", height: "calc(100vh - 110px)" }}>
                <FileTableSmall searchValue={this.props.searchValue} />
              </div>
            </div>
          </div>

          <div className="col s4 rightcol">
          </div>
        </div>
      </div>
    );
  }

  handleSearchValueChange = (ev: any) => {
    // tslint:disable-next-line:no-shadowed-variable
    const { changeSearchValue } = this.props;
    changeSearchValue(ev.target.value);
  }
}

export default connect((state) => {
  return {
    isPerformed: state.multiOperations.performed,
    isPerforming: state.multiOperations.performing,
    location: state.router.location,
    searchValue: state.filters.searchValue,
    status: state.multiOperations.status,
  };
}, { changeSearchValue })(ResultsWindow);
