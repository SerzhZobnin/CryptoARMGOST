import { is } from "immutable";
import * as path from "path";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { AutoSizer, Column, Table } from "react-virtualized";
import { activeFile, deleteFile, selectTempContentOfSignedFiles } from "../../AC";
import { activeFilesSelector, filteredFilesSelector, loadingRemoteFilesSelector } from "../../selectors";
import "../../table.global.css";
import { bytesToSize, mapToArr } from "../../utils";
import ProgressBars from "../ProgressBars";
import SortDirection from "../Sort/SortDirection";
import SortIndicator from "../Sort/SortIndicator";
import FileIcon from "./FileIcon";
import FileItemButtons from "./FileItemButtons";

type TSortDirection = "ASC" | "DESC" | undefined;

interface IFileRedux {
  active: boolean;
  extension: string;
  filename: string;
  fullpath: string;
  id: number;
  lastModifiedDate: Date;
  socket: string;
}

export interface IRemoteFile {
  extra: any;
  id: number;
  loaded: boolean;
  loading: boolean;
  name: string;
  socketId: string;
  totalSize: number;
  url: string;
}

interface IFileTableSmallProps {
  activeFile: (id: number, active?: boolean) => void;
  deleteFile: (fileId: number) => void;
  loadingFiles: IRemoteFile[];
  location: any;
  filesMap: any;
  operation: string;
  selectedFilesPackage: boolean;
  selectingFilesPackage: boolean;
  style: any;
}

interface IFileTableSmallDispatch {
  loadAllCertificates: () => void;
  selectDocument: (uid: number) => void;
  unselectAllDocuments: () => void;
}

interface IFileTableSmallState {
  disableHeader: boolean;
  hoveredRowIndex: number;
  foundDocuments: number[];
  scrollToIndex: number;
  sortBy: string;
  sortDirection: TSortDirection;
  sortedList: any;
}

class FileTableSmall extends React.Component<IFileTableSmallProps & IFileTableSmallDispatch, IFileTableSmallState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: IFileTableSmallProps & IFileTableSmallDispatch) {
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

  componentDidUpdate(prevProps: IFileTableSmallProps & IFileTableSmallDispatch) {
    if (!prevProps.filesMap.size && this.props.filesMap && this.props.filesMap.size ||
      (prevProps.filesMap.size !== this.props.filesMap.size) ||
      (prevProps.activeFilesMap.size !== this.props.activeFilesMap.size)) {
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
    const { loadingFiles, filesMap, searchValue } = this.props;
    const { disableHeader, foundDocuments, scrollToIndex, sortBy, sortDirection, sortedList } = this.state;

    const classDisabledNavigation = foundDocuments.length && foundDocuments.length === 1 ? "disabled" : "";

    const rowGetter = ({ index }: { index: number }) => this.getDatum(this.state.sortedList, index);

    if (!loadingFiles.length && !filesMap.size) {
      return null;
    }

    return (
      <React.Fragment>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "1 1 auto", height: "calc(100vh - 130px)" }}>
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
                  //onRowMouseOut={this.handleOnRowMouseOut}
                  overscanRowCount={3}
                  rowGetter={rowGetter}
                  rowCount={sortedList.size}
                  scrollToIndex={scrollToIndex}
                  sort={this.sort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                >
                  <Column
                    cellRenderer={({ cellData, rowData, rowIndex }) => {
                      const hovered = rowIndex === this.state.hoveredRowIndex;
                      let style;
                      if (hovered) {
                        style = "width: calc(100% - 300px)";
                      }

                      return (
                        <div className="row nobottom">
                          <div className="col s1">
                            <div className="row nobottom">
                              <div className="col s12">
                                <FileIcon file={rowData} />
                              </div>
                            </div>
                          </div>
                          <div className={`col ${hovered ? "s6 m7 l8" : "s11"}`}>
                            <div className="row nobottom">
                              <div className="col s12">
                                <div className="collection-title truncate">{cellData}</div>
                              </div>
                              {/* <div className="col s12">
                                <div className="collection-info cert-info truncate">{path.dirname(rowData.fullpath)}</div>
                              </div> */}
                              <div className="col s5">
                                <div className="collection-info cert-info truncate">{(new Date(rowData.lastModifiedDate)).toLocaleDateString(locale, {
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  month: "numeric",
                                  year: "numeric",
                                })}
                                </div>
                              </div>
                              <div className="col s7">
                                <div className="collection-info cert-info truncate">{bytesToSize(rowData.filesize)}</div>
                              </div>
                            </div>
                          </div>
                          {(hovered) ?
                            <div className="col m2 l2">
                              <FileItemButtons
                                deleteFile={this.props.deleteFile}
                                file={rowData}
                                selectTempContentOfSignedFiles={this.props.selectTempContentOfSignedFiles}
                              />
                            </div>
                            :
                            null}
                        </div>);
                    }
                    }
                    dataKey="filename"
                    disableSort={true}
                    headerRenderer={this.headerRenderer}
                    width={644}
                    label={"Список файлов"}
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

  handleOnRowMouseOver = ({ event, index, rowData }: { event: Event, index: number, rowData: any }) => {
    if (this.state.hoveredRowIndex !== index) {
      this.setState({
        hoveredRowIndex: index,
      });
    }
  }

  handleOnRowMouseOut = () => {
    this.setState({
      hoveredRowIndex: -1,
    });
  }

  handleOnRowClick = ({ rowData }: { rowData: any }) => {
    this.props.activeFile(rowData.id, !rowData.active);
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
    const { activeFilesMap } = this.props;

    if (index < 0) {
      return "headerRow";
    } else {
      let rowClassName = index % 2 === 0 ? "evenRow " : "oddRow ";

      if (activeFilesMap.includes(this.getDatum(this.state.sortedList, index))) {
        rowClassName += "selectedRow ";
      }

      if (index === this.state.hoveredRowIndex) {
        rowClassName += "hoverRow";
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
  activeFilesMap: activeFilesSelector(state, { active: true }),
  filesMap: filteredFilesSelector(state),
  loadingFiles: loadingRemoteFilesSelector(state, { loading: true }),
  selectedFilesPackage: state.files.selectedFilesPackage,
  selectingFilesPackage: state.files.selectingFilesPackage,
}), { activeFile, deleteFile, selectTempContentOfSignedFiles })(FileTableSmall);
