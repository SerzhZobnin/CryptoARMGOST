import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { AutoSizer, CellMeasurer, CellMeasurerCache, createMasonryCellPositioner, Masonry } from "react-virtualized";
import {
  loadAllDocuments, removeAllDocuments, selectDocument,
  unselectAllDocuments,
} from "../../AC/documentsActions";
import { filteredDocumentsSelector, selectedDocumentsSelector } from "../../selectors/documentsSelector";
import "../../table.global.css";
import { extFile, mapToArr } from "../../utils";
import FileIcon from "../Files/FileIcon";
import ProgressBars from "../ProgressBars";
import SortDirection from "../Sort/SortDirection";
import SortIndicator from "../Sort/SortIndicator";

type TSortDirection = "ASC" | "DESC" | undefined;

interface IDocumentsMasonryProps {
  documentsMap: any;
  isLoaded: boolean;
  isLoading: boolean;
  searchValue?: string;
  selectedDocuments: any;
}

interface IDocumentsMasonryDispatch {
  loadAllDocuments: () => void;
  removeAllDocuments: () => void;
  selectDocument: (uid: number) => void;
  unselectAllDocuments: () => void;
}

interface IDocumentsMasonryState {
  columnWidth: number;
  disableHeader: boolean;
  foundDocuments: number[];
  gutterSize: number;
  scrollToIndex: number;
  sortBy: string;
  sortDirection: TSortDirection;
  sortedList: any;
}

class DocumentsMasonry extends React.Component<IDocumentsMasonryProps & IDocumentsMasonryDispatch, IDocumentsMasonryState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };
  // tslint:disable:variable-name
  _cache: CellMeasurerCache;
  _cellPositioner: any;
  _columnCount: number;
  _width: number;
  _masonry: any;
  _height: any;

  constructor(props: IDocumentsMasonryProps & IDocumentsMasonryDispatch) {
    super(props);

    const sortBy = "mtime";
    const sortDirection = SortDirection.DESC;
    const sortedList = this.sortList({ sortBy, sortDirection });

    this.state = {
      columnWidth: 250,
      disableHeader: false,
      foundDocuments: [],
      gutterSize: 10,
      scrollToIndex: 0,
      sortBy,
      sortDirection,
      sortedList,
    };

    this._cache = new CellMeasurerCache({
      defaultHeight: 250,
      defaultWidth: 200,
      fixedWidth: true,
    });

    this._columnCount = 0;

    this._cellRenderer = this._cellRenderer.bind(this);
    this._onResize = this._onResize.bind(this);
    this._renderMasonry = this._renderMasonry.bind(this);
    this._setMasonryRef = this._setMasonryRef.bind(this);
  }

  componentDidMount() {
    // tslint:disable-next-line:no-shadowed-variable
    const { isLoaded, isLoading, loadAllDocuments, removeAllDocuments } = this.props;

    removeAllDocuments();

    if (!isLoading) {
      loadAllDocuments();
    }
  }

  componentDidUpdate(prevProps: IDocumentsMasonryProps & IDocumentsMasonryDispatch) {
    if (!prevProps.documentsMap.size && this.props.documentsMap && this.props.documentsMap.size ||
      (prevProps.documentsMap.size !== this.props.documentsMap.size)) {
      this.sort(this.state);
    }

    if (prevProps.searchValue !== this.props.searchValue && this.props.searchValue) {
      this.search(this.props.searchValue);
    }

    if (prevProps.searchValue && !this.props.searchValue) {
      this.setState({ foundDocuments: [] });
    }
  }

  componentWillUnmount() {
    // tslint:disable-next-line:no-shadowed-variable
    const { unselectAllDocuments } = this.props;

    unselectAllDocuments();
  }

  _cellRenderer(props) {
    const { index, key, parent, style } = props;
    const { locale, localize } = this.context;
    const { columnWidth } = this.state;

    const datum = this.getDatum(this.state.sortedList, index);

    return (
      <CellMeasurer cache={this._cache} index={index} key={key} parent={parent}>
        <div
          style={{
            ...style,
            height: 45,
            width: columnWidth,
          }}>
          <div className={this.rowClassName(index)} onClick={() => this.handleOnRowClick(datum.id)}>
            <FileIcon file={{ extension: extFile(datum.filename), id: datum.id }} key={datum.id} />
            <div className="collection-info-files" style={{ paddingLeft: "50px" }}>
              <div className="truncate">
                {datum.filename}
              </div>
            </div>
            <div className="collection-info-files" style={{ paddingLeft: "50px", fontSize: "70%" }}>
              <div className="truncate">
                {`${this.bytesToSize(datum.filesize)} | ${(new Date(datum.mtime)).toLocaleDateString(locale, {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}`}
              </div>
            </div>
          </div>
        </div>
      </CellMeasurer>
    );
  }

  _initCellPositioner() {
    if (typeof this._cellPositioner === "undefined") {
      const { columnWidth, gutterSize } = this.state;

      this._cellPositioner = createMasonryCellPositioner({
        cellMeasurerCache: this._cache,
        columnCount: this._columnCount,
        columnWidth,
        spacer: gutterSize,
      });
    }
  }

  _calculateColumnCount() {
    const { columnWidth, gutterSize } = this.state;

    this._columnCount = Math.floor(this._width / (columnWidth + gutterSize));
  }

  _onResize({ width }) {
    this._width = width;

    this._calculateColumnCount();
    this._resetCellPositioner();
    this._masonry.recomputeCellPositions();
  }

  _resetCellPositioner() {
    const { columnWidth, gutterSize } = this.state;

    this._cellPositioner.reset({
      columnCount: this._columnCount,
      columnWidth,
      spacer: gutterSize,
    });
  }

  _renderAutoSizer({ height }) {
    this._height = height;

    return (
      <AutoSizer
        disableHeight
        height={height}
        onResize={this._onResize}>
        {this._renderMasonry}
      </AutoSizer>
    );
  }

  _renderMasonry({ width }) {
    const { documentsMap } = this.props;
    const { sortedList } = this.state;

    this._width = width;

    this._calculateColumnCount();
    this._initCellPositioner();

    return (
      <Masonry
        autoHeight={false}
        cellCount={sortedList.size}
        cellMeasurerCache={this._cache}
        cellPositioner={this._cellPositioner}
        cellRenderer={this._cellRenderer}
        height={400}
        ref={this._setMasonryRef}
        width={width}
      />
    );
  }

  _setMasonryRef(ref) {
    this._masonry = ref;
  }

  render() {
    const { locale, localize } = this.context;
    const { documentsMap, isLoading, searchValue } = this.props;
    const { foundDocuments, scrollToIndex } = this.state;

    if (isLoading) {
      return <ProgressBars />;
    }

    const classDisabledNavigation = foundDocuments.length && foundDocuments.length === 1 ? "disabled" : "";

    return (
      <React.Fragment>
        <AutoSizer
          disableHeight
          onResize={this._onResize}
        >
          {this._renderMasonry}
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
      </React.Fragment>
    );
  }

  bytesToSize = (bytes: number, decimals = 2) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];

    if (bytes === 0) {
      return "n/a";
    }

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    if (i === 0) {
      return `${bytes} ${sizes[i]}`;
    }

    return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizes[i]}`;
  }

  handleOnRowClick = (id: any) => {
    // tslint:disable-next-line:no-shadowed-variable
    const { selectDocument } = this.props;

    selectDocument(id);

    this._cache.clearAll();
    this._resetCellPositioner();
    this._masonry.clearCellPositions();
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

  rowClassName = (index: any) => {
    const { foundDocuments } = this.state;
    const { selectedDocuments } = this.props;

    if (index < 0) {
      return "headerRow";
    } else {
      let rowClassName = "";

      if (selectedDocuments.includes(this.getDatum(this.state.sortedList, index))) {
        rowClassName += "selectedEvent";
      } else if (foundDocuments.indexOf(index) >= 0) {
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
    const { documentsMap } = this.props;

    return documentsMap
      .sortBy((item: any) => item[sortBy])
      .update(
        // tslint:disable-next-line:no-shadowed-variable
        (documentsMap: any) => (sortDirection === SortDirection.DESC ? documentsMap.reverse() : documentsMap),
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
  documentsMap: filteredDocumentsSelector(state),
  isLoaded: state.documents.loaded,
  isLoading: state.documents.loading,
  selectedDocuments: selectedDocumentsSelector(state),
  signatures: state.signatures,
}), { loadAllDocuments, removeAllDocuments, selectDocument, unselectAllDocuments })(DocumentsMasonry);
