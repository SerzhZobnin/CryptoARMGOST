import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { AutoSizer, Column, Table } from "react-virtualized";
import { loadAllCertificates, verifyCertificate } from "../../AC";
import { filteredCertificatesSelector } from "../../selectors";
import "../../table.global.css";
import { mapToArr } from "../../utils";
import ProgressBars from "../ProgressBars";
import SortDirection from "../Sort/SortDirection";
import SortIndicator from "../Sort/SortIndicator";
import CertificateStatusIcon from "./CertificateStatusIcon";

type TSortDirection = "ASC" | "DESC" | undefined;

interface ICertificateTableProps {
  activeCert: (cert: any) => void;
  certificate: any;
  certificatesMap: any;
  isLoaded: boolean;
  isLoading: boolean;
  searchValue?: string;
  selectedDocuments: any;
}

interface ICertificateTableDispatch {
  loadAllCertificates: () => void;
  selectDocument: (uid: number) => void;
  unselectAllDocuments: () => void;
}

interface ICertificateTableState {
  disableHeader: boolean;
  foundDocuments: number[];
  scrollToIndex: number;
  sortBy: string;
  sortDirection: TSortDirection;
  sortedList: any;
}

class CertificateTable extends React.Component<ICertificateTableProps & ICertificateTableDispatch, ICertificateTableState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: ICertificateTableProps & ICertificateTableDispatch) {
    super(props);

    const sortBy = "subjectFriendlyName";
    const sortDirection = SortDirection.DESC;
    const sortedList = this.sortList({ sortBy, sortDirection });

    this.state = {
      disableHeader: false,
      foundDocuments: [],
      scrollToIndex: 0,
      sortBy,
      sortDirection,
      sortedList,
    };
  }

  componentDidMount() {
    // tslint:disable-next-line:no-shadowed-variable
    const { isLoaded, isLoading, loadAllCertificates } = this.props;

    if (!isLoading && !isLoaded) {
      loadAllCertificates();
    }

  }

  componentDidUpdate(prevProps: ICertificateTableProps & ICertificateTableDispatch) {
    if (!prevProps.certificatesMap.size && this.props.certificatesMap && this.props.certificatesMap.size ||
      (prevProps.certificatesMap.size !== this.props.certificatesMap.size)) {
      this.sort(this.state);
    }

    if (prevProps.searchValue !== this.props.searchValue && this.props.searchValue) {
      this.search(this.props.searchValue);
    }

    if (prevProps.searchValue && !this.props.searchValue) {
      this.setState({ foundDocuments: [] });
    }
  }

  render() {
    const { locale, localize } = this.context;
    const { isLoading, verifyCertificate, searchValue } = this.props;
    const { disableHeader, foundDocuments, scrollToIndex, sortBy, sortDirection, sortedList } = this.state;

    if (isLoading) {
      return <ProgressBars />;
    }

    const classDisabledNavigation = foundDocuments.length && foundDocuments.length === 1 ? "disabled" : "";

    const rowGetter = ({ index }: { index: number }) => this.getDatum(this.state.sortedList, index);

    return (
      <React.Fragment>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1 1 auto", height: "calc(100vh - 128px)" }}>
            <AutoSizer>
              {({ height, width }) => (
                <Table
                  ref="Table"
                  disableHeader={disableHeader}
                  height={height}
                  width={width}
                  headerHeight={30}
                  noRowsRenderer={this.noRowsRenderer}
                  headerClassName={"headerColumn"}
                  rowHeight={45}
                  rowClassName={this.rowClassName}
                  onRowClick={this.handleOnRowClick}
                  onRowsRendered={this.handleOnRowsRendered}
                  overscanRowCount={3}
                  rowGetter={rowGetter}
                  rowCount={sortedList.size}
                  scrollToIndex={scrollToIndex}
                  sort={this.sort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                >
                  <Column
                    cellRenderer={({ cellData, rowData }) =>
                      <CertificateStatusIcon certificate={rowData} verifyCertificate={verifyCertificate} />
                    }
                    dataKey="status"
                    disableSort={false}
                    headerRenderer={this.headerRenderer}
                    width={80}
                    label={"Статус"}
                  />
                  <Column
                    dataKey="subjectFriendlyName"
                    disableSort={false}
                    headerRenderer={this.headerRenderer}
                    width={300}
                    label={localize("Certificate.subject", locale)}
                  />
                  <Column
                    dataKey="issuerFriendlyName"
                    disableSort={false}
                    headerRenderer={this.headerRenderer}
                    width={300}
                    label={localize("Certificate.issuer_name", locale)}
                  />
                  <Column
                    cellRenderer={({ cellData }) => {
                      return (new Date(cellData)).toLocaleDateString(locale, {
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        month: "numeric",
                        year: "numeric",
                      });
                    }}
                    dataKey="notAfter"
                    disableSort={false}
                    headerRenderer={this.headerRenderer}
                    width={300}
                    label={localize("Certificate.cert_valid", locale)}
                  />
                </Table>
              )}
            </AutoSizer>
          </div>
        </div>
        {searchValue && foundDocuments.length ?
          <div className="card navigationToolbar valign-wrapper">
            <i className={"small material-icons cryptoarm-blue waves-effect " + classDisabledNavigation} onClick={this.handleScrollToFirstOfFoud}>first_page</i>
            <i className={"small material-icons cryptoarm-blue waves-effect " + classDisabledNavigation} onClick={this.handleScrollToBefore}>navigate_before</i>
            <div style={{ color: "black" }}>
              {foundDocuments.indexOf(scrollToIndex) + 1}/{foundDocuments.length}
            </div>
            <i className={"small material-icons cryptoarm-blue waves-effect " + classDisabledNavigation} onClick={this.handleScrollToNext}>navigate_next</i>
            <i className={"small material-icons cryptoarm-blue waves-effect " + classDisabledNavigation} onClick={this.handleScrollToLastOfFoud}>last_page</i>
          </div> :
          null}
      </React.Fragment>
    );
  }

  handleOnRowClick = ({ rowData }: { rowData: any }) => {
    this.props.activeCert(rowData);
  }

  handleScrollToBefore = () => {
    const { foundDocuments, scrollToIndex } = this.state;

    if (foundDocuments.indexOf(scrollToIndex) - 1 >= 0) {
      this.scrollToRow(foundDocuments[foundDocuments.indexOf(scrollToIndex) - 1]);
    }
  }

  handleScrollToNext = () => {
    const { foundDocuments, scrollToIndex } = this.state;

    if (foundDocuments.indexOf(scrollToIndex) + 1 < foundDocuments.length) {
      this.scrollToRow(foundDocuments[foundDocuments.indexOf(scrollToIndex) + 1]);
    }
  }

  handleScrollToFirstOfFoud = () => {
    const { foundDocuments } = this.state;

    this.scrollToRow(foundDocuments[0]);
  }

  handleScrollToLastOfFoud = () => {
    const { foundDocuments } = this.state;

    this.scrollToRow(foundDocuments[foundDocuments.length - 1]);
  }

  getDatum = (list: any, index: number) => {
    const arr = mapToArr(list);

    return arr[index];
  }

  rowClassName = ({ index }: { index: number }) => {
    const { certificate } = this.props;

    if (index < 0) {
      return "headerRow";
    } else {
      let rowClassName = index % 2 === 0 ? "evenRow " : "oddRow ";

      const datum = this.getDatum(this.state.sortedList, index);

      if (datum && certificate && datum.id === certificate.id) {
        rowClassName += "selectedRow";
      }

      return rowClassName;
    }
  }

  sort = ({ sortBy, sortDirection }: { sortBy: string, sortDirection: TSortDirection }) => {
    const sortedList = this.sortList({ sortBy, sortDirection });

    this.setState({ sortBy, sortDirection, sortedList });

    this.search(this.props.searchValue, sortedList);
  }

  search = (searchValue: string | undefined, list?: any) => {
    const { locale, localize } = this.context;
    const { sortedList } = this.state;

    if (!searchValue) {
      this.setState({ foundDocuments: [] });
      return;
    }

    const arr = list ? mapToArr(list) : mapToArr(sortedList);

    const foundDocuments: number[] = [];
    const search = searchValue.toLowerCase();

    arr.forEach((document: any, index: number) => {
      if (document.filename.toLowerCase().match(search)) {
        foundDocuments.push(index);
      }
    });

    if (!foundDocuments.length) {
      $(".toast-no_found_events").remove();
      Materialize.toast(localize("EventsFilters.no_found_events", locale), 2000, "toast-no_found_events");
    }

    this.scrollToRow(foundDocuments[0]);

    this.setState({ foundDocuments });
  }

  sortList = ({ sortBy, sortDirection }: { sortBy: string, sortDirection: TSortDirection }) => {
    const { certificatesMap } = this.props;

    return certificatesMap
      .sortBy((item: any) => item[sortBy])
      .update(
        // tslint:disable-next-line:no-shadowed-variable
        (certificatesMap: any) => (sortDirection === SortDirection.DESC ? certificatesMap.reverse() : certificatesMap),
      );
  }

  headerRenderer = ({ dataKey, label, sortBy, sortDirection }: { dataKey?: string, label?: string, sortBy?: string, sortDirection?: TSortDirection }) => {
    return (
      <React.Fragment>
        {label}
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </React.Fragment>
    );
  }

  noRowsRenderer = () => {
    const { locale, localize } = this.context;

    return <div className={"noRows"}>{localize("EventsTable.no_rows", locale)}</div>;
  }

  scrollToRow = (index: number) => {
    this.setState({ scrollToIndex: index });
  }
}

interface IOwnProps {
  operation: string;
}

export default connect((state, ownProps: IOwnProps) => ({
  certificatesMap: filteredCertificatesSelector(state, { operation: ownProps.operation }),
  isLoaded: state.certificates.loaded,
  isLoading: state.certificates.loading,
}), { loadAllCertificates, verifyCertificate })(CertificateTable);
