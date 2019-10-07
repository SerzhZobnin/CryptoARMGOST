import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { changeSearchValue } from "../../AC/searchActions";
import { deleteService } from "../../AC/servicesActions";
import { filteredServicesSelector } from "../../selectors/servicesSelectors";
import { mapToArr } from "../../utils";
import BlockNotElements from "../BlockNotElements";
import BlockWithReference from "../BlockWithReference";
import Modal from "../Modal";
import AddService from "./AddService";
import DeleteService from "./DeleteService";
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
      service: null,
      showModalAddService: false,
      showModalDeleteService: false,
    };
  }

  componentDidMount() {
    $(".btn-floated").dropdown();
  }

  render() {
    const { localize, locale } = this.context;
    const { isDefaultFilters, searchValue } = this.props;
    const { service } = this.state;

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
                    value={searchValue}
                    onChange={this.handleSearchValueChange} />
                  <i className="material-icons close" onClick={() => this.props.changeSearchValue("")} style={this.state.searchValue ? { color: "#444" } : {}}>close</i>
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

            {
              service ?
                <div className="row fixed-bottom-rightcolumn" style={{ position: "relative", bottom: "70px" }}>
                  <div className="col s12">
                    <hr />
                  </div>
                  <div className="col s4 waves-effect waves-cryptoarm">
                    <div className="col s12 svg_icon">
                      <a data-position="bottom">
                        <i className="material-icons ca new_request" />
                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">Создать запрос</div>
                  </div>

                  <div className="col s4 waves-effect waves-cryptoarm" onClick={this.handleShowModalDeleteService}>
                    <div className="col s12 svg_icon">
                      <a data-position="bottom">
                        <i className="material-icons certificate remove" />
                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">{localize("Documents.docmenu_remove", locale)}</div>
                  </div>
                </div> :
                null
            }

          </div>
        </div>
        {this.showModalAddService()}
        {this.showModalDeleteService()}
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
    const { certificates, certrequests, regrequests } = this.props;
    const { localize, locale } = this.context;

    const regRequest = regrequests.find((obj: any) => obj.get("serviceId") === service.id);
    const certrequest = certrequests.find((obj: any) => obj.get("serviceId") === service.id);
    const certificate = certrequest ? certificates.getIn(["entities", certrequest.certificateId]) : null;

    let ser: any = null;
    ser = <ServiceInfo service={{
      ...service.toJS(), login: regRequest ? regRequest.Token : "",
      password: regRequest ? regRequest.Password : "",
      comment: regRequest ? regRequest.Comment : "",
      keyPhrase: regRequest ? regRequest.KeyPhrase : "",
      email: regRequest ? regRequest.Email : "",
    }} certificate={certificate} />;

    return (
      <div className="add-services">
        {ser}
      </div>
    );
  }

  handleSearchValueChange = (ev: any) => {
    const { changeSearchValue } = this.props;
    changeSearchValue(ev.target.value);
  }

  handleActiveService = (service: any) => {
    if (this.state.service && this.state.service.id === service.id) {
      this.setState({ service: null });
    } else {
      this.setState({ service });
    }
  }

  handleShowModalAddService = () => {
    this.setState({ showModalAddService: true });
  }

  handleCloseModalAddService = () => {
    this.setState({ showModalAddService: false });
  }

  handleShowModalDeleteService = () => {
    this.setState({ showModalDeleteService: true });
  }

  handleCloseModalDeleteService = () => {
    this.setState({ showModalDeleteService: false });
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

  showModalDeleteService = () => {
    const { localize, locale } = this.context;
    const { service, showModalDeleteService } = this.state;

    if (!service || !showModalDeleteService) {
      return;
    }

    return (
      <Modal
        isOpen={showModalDeleteService}
        header={localize("Services.delete_service", locale)}
        onClose={this.handleCloseModalDeleteService}>

        <DeleteService
          deleteService={this.handleDeleteService}
          service={service}
          onCancel={this.handleCloseModalDeleteService} />
      </Modal>
    );
  }

  handleDeleteService = (serviceId: string) => {
    this.setState({ service: null });
    this.props.deleteService(serviceId);
  }
}

export default connect((state) => {
  return {
    certificates: state.certificates,
    certrequests: state.certrequests.entities,
    isDefaultFilters: state.filters.documents.isDefaultFilters,
    regrequests: state.regrequests.entities,
    searchValue: state.filters.searchValue,
    services: filteredServicesSelector(state),
  };
}, { changeSearchValue, deleteService })(ServiceWindow);
