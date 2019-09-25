import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { changeSearchValue } from "../../AC/searchActions";

const dialog = window.electron.remote.dialog;
import { mapToArr } from "../../utils";
import BlockNotElements from "../BlockNotElements";
import BlockWithReference from "../BlockWithReference";
import Modal from "../Modal";
import AddService from "./AddService";
import ServiceInfo from "./ServiceInfo";
import ServicesList from "./ServiceList";
import { IService } from "./types";

class ServiceWindow extends React.Component<any, any> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: any) {
    super(props);

    this.state = {
      activeService: undefined,
      searchValue: "",
      service: null,
      showModalAddService: false,
    };
  }

  componentDidMount() {
    $(".btn-floated").dropdown();
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
                <a onClick={this.handleShowModalAddService.bind(this)}>
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
            <div className={"collection"}>
              <div className="row">
                <div className="col s12">
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: "1 1 auto", height: "calc(100vh - 130px)" }}>
                      {
                        this.props.services.size < 1 ?
                          <BlockWithReference name={"active"} title={localize("Services.services_not_found", locale)} icon={"block"}
                            reference={""} titleRef={localize("Services.services_add_item", locale)} onBtnClick={this.handleShowModalAddService} /> :
                          <ServicesList activeService={this.handleActiveService} />
                      }
                    </div>
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
                  {this.getServiceInfo()}
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.showModalAddService()}
      </div>
    );
  }

  getServiceInfo() {
    const { service } = this.state;
    const { localize, locale } = this.context;

    if (service) {
      return this.getServiceInfoBody();
    } else {
      return <BlockNotElements name={"active"} title={localize("Services.services_not_select", locale)} />;
    }
  }

  getServiceInfoBody() {
    const { service } = this.state;
    const { localize, locale } = this.context;

    let ser: any = null;
    ser = <ServiceInfo service={service} />;

    return (
      <div className="add-certs">
        {ser}
      </div>
    );
  }

  handleSearchValueChange = (ev: any) => {
    this.setState({ searchValue: ev.target.value });
  }

  handleActiveService = (service: any) => {
    this.setState({ service });
  }

  handleShowModalAddService = () => {
    this.setState({ showModalAddService: true });
  }

  handleCloseModalAddService = () => {
    this.setState({ showModalAddService: false });
  }

  handleOnCancelAddService = (service: IService) => {
    if (service) {
      this.setState({
        activeService: service,
      });
    }

    this.handleCloseModalAddService();
  }

  showModalAddService = () => {
    const { localize, locale } = this.context;
    const { showModalAddService } = this.state;

    if (!showModalAddService) {
      return;
    }

    return (
      <Modal
        isOpen={showModalAddService}
        header={localize("Services.add_new_service", locale)}
        onClose={this.handleCloseModalAddService} style={{
          width: "70%",
        }}>

        <AddService onCancel={this.handleOnCancelAddService} />
      </Modal>
    );
  }
}

export default connect((state) => {
  return {
    isDefaultFilters: state.filters.documents.isDefaultFilters,
    searchValue: state.filters.searchValue,
    services: state.services.entities,
  };
}, { changeSearchValue })(ServiceWindow);
