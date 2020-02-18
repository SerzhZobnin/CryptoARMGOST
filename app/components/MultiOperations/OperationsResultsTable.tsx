import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { AutoSizer, Column, Table } from "react-virtualized";
import { selectDocument } from "../../AC/multiOperations";
import { filteredOperationsResultsSelector, selectedOperationsResultsSelector } from "../../selectors/operationsResultsSelector";
import "../../table.global.css";
import { bytesToSize, extFile, mapToArr } from "../../utils";
import FileIcon from "../Files/FileIcon";
import SortDirection from "../Sort/SortDirection";
import SortIndicator from "../Sort/SortIndicator";

type TSortDirection = "ASC" | "DESC" | undefined;

interface IFileRedux {
  active: boolean;
  extension: string;
  filename: string;
  fullpath: string;
  id: number;
  mtime: Date;
  socket: string;
}

interface IOperationsResultsTableProps {
  activeFile: (id: number, active?: boolean) => void;
  location: any;
  filesMap: any;
  operation: string;
  selectedFilesPackage: boolean;
  selectingFilesPackage: boolean;
  style: any;
}

interface IOperationsResultsTableDispatch {
  loadAllCertificates: () => void;
  selectDocument: (uid: number) => void;
  unselectAllDocuments: () => void;
}

interface IOperationsResultsTableState {
  disableHeader: boolean;
  hoveredRowIndex: number;
  foundDocuments: number[];
  scrollToIndex: number;
  sortBy: string;
  sortDirection: TSortDirection;
  sortedList: any;
}

class OperationsResultsTable extends React.Component<IOperationsResultsTableProps & IOperationsResultsTableDispatch, IOperationsResultsTableState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: IOperationsResultsTableProps & IOperationsResultsTableDispatch) {
    super(props);

    const sortBy = "filename";
    const sortDirection = SortDirection.DESC;
    const sortedList = this.sortList({ sortBy, sortDirection });

    this.state = {
      disableHeader: false,
      foundDocuments: [],
      hoveredRowIndex: -1,
      scrollToIndex: 0,
      sortBy,
      sortDirection,
      sortedList,
    };
  }
  componentDidUpdate(prevProps: IOperationsResultsTableProps & IOperationsResultsTableDispatch) {
    if (!prevProps.filesMap.size && this.props.filesMap && this.props.filesMap.size ||
      (prevProps.filesMap.size !== this.props.filesMap.size)) {
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
    const { searchValue } = this.props;
    const { disableHeader, foundDocuments, scrollToIndex, sortBy, sortDirection, sortedList } = this.state;

    const classDisabledNavigation = foundDocuments.length && foundDocuments.length === 1 ? "disabled" : "";

    const rowGetter = ({ index }: { index: number }) => this.getDatum(this.state.sortedList, index);

    return (
      <React.Fragment>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1 1 auto", height: "calc(100vh - 110px)" }}>
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
                  onRowMouseOver={this.handleOnRowMouseOver}
                  onRowMouseOut={this.handleOnRowMouseOut}
                  overscanRowCount={3}
                  rowGetter={rowGetter}
                  rowCount={sortedList.size}
                  scrollToIndex={scrollToIndex}
                  sort={this.sort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                >
                  <Column
                    cellRenderer={({ cellData, rowData }) => {
                      return (
                        <FileIcon file={{ extension: extFile(rowData.filename), id: rowData.id }} key={rowData.id} />
                      );
                    }}
                    dataKey="extension"
                    disableSort={false}
                    headerRenderer={this.headerRenderer}
                    width={50}
                    label={localize("Documents.type", locale)}
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
                    dataKey="mtime"
                    disableSort={false}
                    headerRenderer={this.headerRenderer}
                    width={155}
                    label={localize("Documents.mtime", locale)}
                  />
                  <Column
                    dataKey="filename"
                    disableSort={false}
                    headerRenderer={this.headerRenderer}
                    width={width * 0.48}
                    label={localize("Documents.filename", locale)}
                  />
                  <Column
                    cellRenderer={({ cellData, rowData, rowIndex }) => {
                      return (
                        <div className="row nobottom">
                          <div className="col s12">
                            <div className="truncate">{bytesToSize(cellData)}</div>
                          </div>
                        </div>
                      );
                    }}
                    dataKey="filesize"
                    disableSort={false}
                    headerRenderer={this.headerRenderer}
                    width={width * 0.22}
                    label={localize("Documents.filesize", locale)}
                  />
                </Table>
              )}
            </AutoSizer>
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
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleOnRowMouseOver = ({ event, index, rowData }: { event: Event, index: number, rowData: any }) => {
    this.setState({
      hoveredRowIndex: index,
    });
  }

  handleOnRowMouseOut = () => {
    this.setState({
      hoveredRowIndex: -1,
    });
  }

  handleOnRowClick = ({ rowData }: { rowData: any }) => {
    // tslint:disable-next-line:no-shadowed-variable
    const { selectDocument } = this.props;

    selectDocument(rowData.id);
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
    const { foundDocuments } = this.state;
    const { selectedFilesMap, selectedFiles } = this.props;

    if (index < 0) {
      return "headerRow";
    } else {
      let rowClassName = index % 2 === 0 ? "evenRow " : "oddRow ";

      const doc = this.getDatum(this.state.sortedList, index);

      const founded = foundDocuments.indexOf(index) >= 0;
      const selected = selectedFiles.includes(doc);

      if (founded && selected) {
        rowClassName += "foundAndSelectedEvent ";
      } else if (founded) {
        rowClassName += "foundEvent ";
      } else if (selected) {
        rowClassName += "selectedRow ";
      }

      if (doc.id === selectedFilesMap.last()) {
        rowClassName += "lastSelectedRow ";
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
      try {
        if (document.filename.toLowerCase().match(search)) {
          foundDocuments.push(index);
        }
      } catch (e) {
        //
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
    const { filesMap } = this.props;

    return filesMap
      .sortBy((item: any) => item[sortBy])
      .update(
        // tslint:disable-next-line:no-shadowed-variable
        (filesMap: any) => (sortDirection === SortDirection.DESC ? filesMap.reverse() : filesMap),
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

    return <div className={"add-file-item not-active"} id="items-hidden">
      <div className="headline6 add-file-item-text">{localize("Settings.drag_drop", locale)}</div>
      <i className="material-icons large fullscreen">fullscreen</i>
    </div>;
  }

  scrollToRow = (index: number) => {
    this.setState({ scrollToIndex: index });
  }
}

export default connect((state: any) => ({
  filesMap: filteredOperationsResultsSelector(state),
  selectedFiles: selectedOperationsResultsSelector(state),
  selectedFilesMap: state.multiOperations.selected,
}), { selectDocument })(OperationsResultsTable);
