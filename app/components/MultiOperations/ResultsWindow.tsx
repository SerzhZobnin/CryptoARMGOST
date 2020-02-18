import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { resetDocumentsFilters } from "../../AC/documentsFiltersActions";
import { changeSearchValue } from "../../AC/searchActions";
import FilterDocuments from "../Documents/FilterDocuments";
import Modal from "../Modal";
import ProgressBars from "../ProgressBars";
import FileTableSmall from "./OperationsResultsTable";
import ResultsRightColumn from "./ResultsRightColumn";

class ResultsWindow extends React.Component<any, any> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: any) {
    super(props);

    this.state = {
      showModalFilterDocments: false,
    };
  }

  componentWillUnmount() {
    this.props.resetDocumentsFilters();
  }

  render() {
    const { isDefaultFilters, isPerforming, searchValue } = this.props;
    const { localize, locale } = this.context;

    if (isPerforming) {
      return <ProgressBars />;
    }

    const classDefaultFilters = isDefaultFilters ? "filter_off" : "filter_on";

    return (
      <div className="content-noflex">
        <div className="row">
          <div className="col s8 leftcol">
            <div className="row halfbottom">
              <div className="row halfbottom" />
              <div className="col" style={{ width: "calc(100% - 80px)" }}>
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
              <div className="col" style={{ width: "40px" }}>
                <a onClick={this.handleShowModalFilterDocuments}>
                  <i className={`file-setting-item waves-effect material-icons secondary-content`}>
                    <i className={`material-icons ${classDefaultFilters}`} />
                  </i>
                </a>
              </div>
              <div className="col" style={{ width: "40px" }}>
                <div>
                  <a className="btn-floated" data-activates="dropdown-btn-set-add-files">
                    <i className="file-setting-item waves-effect material-icons secondary-content">more_vert</i>
                  </a>
                  <ul id="dropdown-btn-set-add-files" className="dropdown-content">
                    <li><a onClick={this.handleSelectAllDocuments}>{localize("Documents.selected_all", locale)}</a></li>
                    <li><a onClick={this.handleUnselectAllDocuments}>{localize("Documents.unselect_all", locale)}</a></li>
                  </ul>
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
          <div className="row halfbottom" />
            <ResultsRightColumn />
          </div>
        </div>
        {this.showModalFilterDocuments()}
      </div>
    );
  }

  showModalFilterDocuments = () => {
    const { localize, locale } = this.context;
    const { showModalFilterDocments } = this.state;

    if (!showModalFilterDocments) {
      return;
    }

    return (
      <Modal
        isOpen={showModalFilterDocments}
        header={localize("Filters.filters_settings", locale)}
        onClose={this.handleCloseModalFilterDocuments}>

        <FilterDocuments onCancel={this.handleCloseModalFilterDocuments} />
      </Modal>
    );
  }

  handleSearchValueChange = (ev: any) => {
    // tslint:disable-next-line:no-shadowed-variable
    const { changeSearchValue } = this.props;
    changeSearchValue(ev.target.value);
  }

  handleShowModalFilterDocuments = () => {
    this.setState({ showModalFilterDocments: true });
  }

  handleCloseModalFilterDocuments = () => {
    this.setState({ showModalFilterDocments: false });
  }

  handleSelectAllDocuments = () => {
    //
  }

  handleUnselectAllDocuments = () => {
    //
  }
}

export default connect((state: any) => {
  return {
    isDefaultFilters: state.filters.documents.isDefaultFilters,
    isPerformed: state.multiOperations.performed,
    isPerforming: state.multiOperations.performing,
    location: state.router.location,
    searchValue: state.filters.searchValue,
    status: state.multiOperations.status,
  };
}, { changeSearchValue, resetDocumentsFilters })(ResultsWindow);
