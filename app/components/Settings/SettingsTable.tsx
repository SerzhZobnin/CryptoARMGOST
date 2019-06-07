import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { AutoSizer, Column, Table } from "react-virtualized";
import { loadAllEvents, removeAllEvents } from "../../AC/eventsActions";
import { filteredEventsSelector } from "../../selectors/eventsSelectors";
import "../../table.global.css";
import { mapToArr } from "../../utils";
import ProgressBars from "../ProgressBars";
import SortDirection from "../Sort/SortDirection";
import SortIndicator from "../Sort/SortIndicator";

type TSortDirection = "ASC" | "DESC" | undefined;

interface ISettingsTableProps {
  settingsMap: any;
  isLoaded: boolean;
  isLoading: boolean;
  searchValue?: string;
}

interface ISettingsTableDispatch {
  loadAllEvents: () => void;
  removeAllEvents: () => void;
}

interface ISettingsTableState {
  disableHeader: boolean;
  foundSettings: number[];
  scrollToIndex: number;
  sortBy: string;
  sortDirection: TSortDirection;
  sortedList: any;
}

class SettingsTable extends React.Component<ISettingsTableProps & ISettingsTableDispatch, ISettingsTableState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: ISettingsTableProps & ISettingsTableDispatch) {
    super(props);

    const sortBy = "name";
    const sortDirection = SortDirection.DESC;
    const sortedList = this.sortList({ sortBy, sortDirection });

    this.state = {
      disableHeader: false,
      foundSettings: [],
      scrollToIndex: 0,
      sortBy,
      sortDirection,
      sortedList,
    };
  }

  componentDidUpdate(prevProps: ISettingsTableProps & ISettingsTableDispatch) {
    if (!prevProps.settingsMap.size && this.props.settingsMap && this.props.settingsMap.size ||
      (prevProps.settingsMap.size !== this.props.settingsMap.size)) {
      this.sort(this.state);
    }

    if (prevProps.searchValue !== this.props.searchValue && this.props.searchValue) {
      this.search(this.props.searchValue);
    }

    if (prevProps.searchValue && !this.props.searchValue) {
      this.setState({ foundSettings: [] });
    }
  }

  render() {
    const { locale, localize } = this.context;
    const { isLoading, searchValue } = this.props;
    const { disableHeader, foundSettings, scrollToIndex, sortBy, sortDirection, sortedList } = this.state;

    if (isLoading) {
      return <ProgressBars />;
    }

    const classDisabledNavigation = foundSettings.length && foundSettings.length === 1 ? "disabled" : "";

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
                  overscanRowCount={5}
                  rowGetter={rowGetter}
                  rowCount={sortedList.size}
                  scrollToIndex={scrollToIndex}
                  sort={this.sort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                >
                  <Column
                    dataKey="name"
                    disableSort={false}
                    headerRenderer={this.headerRenderer}
                    width={width * 0.7}
                    label={localize("Settings.name", locale)}
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
                    width={width * 0.3}
                    label={localize("Settings.date_of_change", locale)}
                  />
                </Table>
              )}
            </AutoSizer>
          </div>
        </div>
        {searchValue && foundSettings.length ?
          <div className="card navigationToolbar valign-wrapper">
            <i className={"small material-icons cryptoarm-blue waves-effect " + classDisabledNavigation} onClick={this.handleScrollToFirstOfFoud}>first_page</i>
            <i className={"small material-icons cryptoarm-blue waves-effect " + classDisabledNavigation} onClick={this.handleScrollToBefore}>navigate_before</i>
            <div style={{ color: "black" }}>
              {foundSettings.indexOf(scrollToIndex) + 1}/{foundSettings.length}
            </div>
            <i className={"small material-icons cryptoarm-blue waves-effect " + classDisabledNavigation} onClick={this.handleScrollToNext}>navigate_next</i>
            <i className={"small material-icons cryptoarm-blue waves-effect " + classDisabledNavigation} onClick={this.handleScrollToLastOfFoud}>last_page</i>
          </div> :
          null}
      </React.Fragment>
    );
  }

  handleOnRowClick = ({ rowData }: { rowData: any }) => {
    this.props.selectSetting(rowData);
  }

  handleScrollToBefore = () => {
    const { foundSettings, scrollToIndex } = this.state;

    if (foundSettings.indexOf(scrollToIndex) - 1 >= 0) {
      this.scrollToRow(foundSettings[foundSettings.indexOf(scrollToIndex) - 1]);
    }
  }

  handleScrollToNext = () => {
    const { foundSettings, scrollToIndex } = this.state;

    if (foundSettings.indexOf(scrollToIndex) + 1 < foundSettings.length) {
      this.scrollToRow(foundSettings[foundSettings.indexOf(scrollToIndex) + 1]);
    }
  }

  handleScrollToFirstOfFoud = () => {
    const { foundSettings } = this.state;

    this.scrollToRow(foundSettings[0]);
  }

  handleScrollToLastOfFoud = () => {
    const { foundSettings } = this.state;

    this.scrollToRow(foundSettings[foundSettings.length - 1]);
  }

  getDatum = (list: any, index: number) => {
    const arr = mapToArr(list);

    return arr[index];
  }

  rowClassName = ({ index }: { index: number }) => {
    const { foundSettings } = this.state;
    const { setting } = this.props;

    if (index < 0) {
      return "headerRow";
    } else {
      let rowClassName = index % 2 === 0 ? "evenRow " : "oddRow ";

      const datum = this.getDatum(this.state.sortedList, index);

      if (datum && setting && datum.id === setting.id) {
        rowClassName += "selectedRow ";
      }

      if (foundSettings.indexOf(index) >= 0) {
        rowClassName += "foundEvent";
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
      this.setState({ foundSettings: [] });
      return;
    }

    const arr = list ? mapToArr(list) : mapToArr(sortedList);

    const foundSettings: number[] = [];
    const search = searchValue.toLowerCase();

    arr.forEach((setting: any, index: number) => {
      if (setting.name.toLowerCase().match(search)) {
        foundSettings.push(index);
      }
    });

    if (!foundSettings.length) {
      $(".toast-no_found_events").remove();
      Materialize.toast(localize("EventsFilters.no_found_events", locale), 2000, "toast-no_found_events");
    }

    this.scrollToRow(foundSettings[0]);

    this.setState({ foundSettings });
  }

  sortList = ({ sortBy, sortDirection }: { sortBy: string, sortDirection: TSortDirection }) => {
    const { settingsMap } = this.props;

    return settingsMap
      .sortBy((item: any) => item[sortBy])
      .update(
        // tslint:disable-next-line:no-shadowed-variable
        (settingsMap: any) => (sortDirection === SortDirection.DESC ? settingsMap.reverse() : settingsMap),
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

export default connect((state) => ({
  settingsMap: state.settings.entities,
}), { loadAllEvents, removeAllEvents })(SettingsTable);
