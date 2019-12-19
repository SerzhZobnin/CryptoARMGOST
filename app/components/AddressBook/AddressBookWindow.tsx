import * as os from "os";
import PropTypes from "prop-types";
import React from "react";
import Media from "react-media";
import { connect } from "react-redux";
import { loadAllCertificates, loadAllContainers, removeAllCertificates, removeAllContainers } from "../../AC";
import { changeSearchValue } from "../../AC/searchActions";
import {
  ADDRESS_BOOK, DEFAULT_CSR_PATH, MODAL_ADD_CERTIFICATE,
  MODAL_DELETE_CERTIFICATE, MODAL_DELETE_CRL, MODAL_DELETE_REQUEST_CA,
  MODAL_EXPORT_CERTIFICATE, MODAL_EXPORT_CRL, MODAL_EXPORT_REQUEST_CA,
  PROVIDER_CRYPTOPRO, REQUEST, ROOT, USER_NAME,
} from "../../constants";
import { filteredCertificatesSelector } from "../../selectors";
import { filteredCrlsSelector } from "../../selectors/crlsSelectors";
import { fileCoding } from "../../utils";
import logger from "../../winstonLogger";
import BlockNotElements from "../BlockNotElements";
import AddCertificate from "../Certificate/AddCertificate";
import CertificateChainInfo from "../Certificate/CertificateChainInfo";
import CertificateDelete from "../Certificate/CertificateDelete";
import CertificateExport from "../Certificate/CertificateExport";
import CertificateInfo from "../Certificate/CertificateInfo";
import CertificateInfoTabs from "../Certificate/CertificateInfoTabs";
import CertificateList from "../Certificate/CertificateList";
import CRLInfo from "../CRL/CRLInfo";
import Modal from "../Modal";
import ProgressBars from "../ProgressBars";
import RequestCAInfo from "../Request/RequestCAInfo";

const OS_TYPE = os.type();

class AddressBookWindow extends React.Component<any, any> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: any) {
    super(props);

    this.state = ({
      activeCertInfoTab: true,
      certificate: null,
      crl: null,
      importingCertificate: null,
      importingCertificatePath: null,
      password: "",
      requestCA: null,
      showModalAddCertificate: false,
      showModalDeleteCertifiacte: false,
      showModalExportCRL: false,
      showModalExportCertifiacte: false,
    });
  }

  componentDidMount() {
    $(".btn-floated").dropdown();
  }

  componentDidUpdate(prevProps, prevState) {
    const { isLoading } = this.props;
    const { certificate, crl } = this.state;

    if ((!prevState.certificate && certificate) || (!prevState.crl && crl)) {
      $(".nav-small-btn").dropdown();
    }

    if (prevProps.isLoading && !isLoading) {
      $(".btn-floated").dropdown();
    }
  }

  render() {
    const { certificates, crls, isLoading, isLoadingFromDSS, searchValue } = this.props;
    const { certificate, crl, requestCA } = this.state;
    const { localize, locale } = this.context;

    if (isLoading || isLoadingFromDSS) {
      return <ProgressBars />;
    }

    const VIEW = certificates.size < 1 && crls.length < 1 ? "not-active" : "";

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
                  <i className="material-icons close" onClick={() => this.props.changeSearchValue("")} style={this.state.searchValue ? { color: "#444" } : {}}>close</i>
                </div>
              </div>
              <div className="col" style={{ width: "40px", marginLeft: "20px" }}>
                <a onClick={this.handleReloadCertificates}>
                  <i className="file-setting-item waves-effect material-icons secondary-content">autorenew</i>
                </a>
              </div>
              <div>
                <input type="file" id="choose-cert" value="" onChange={(event: any) => {
                  this.handleCertificateImport(event.target.files);
                }} />
              </div>
            </div>
            <div className={"collection " + VIEW}>
              <div style={{ flex: "1 1 auto", height: "calc(100vh - 110px)" }}>
                {
                  certificates.size < 1 && crls.length < 1 ?
                    <BlockNotElements name={"active"} title={localize("Certificate.cert_not_found", locale)} /> :
                    <CertificateList
                      selectedCert={this.state.certificate}
                      activeCert={this.handleActiveCert}
                      activeCrl={this.handleActiveCRL}
                      activeRequestCA={this.handleActiveRequestCA}
                      operation="address_book" />
                }
              </div>
            </div>
          </div>

          <div className="col s4 rightcol">
            <div className="row halfbottom" />
            <div className="row">
              <div style={{ height: "calc(100vh - 110px)" }}>
                {this.getCertificateOrCRLInfo()}
              </div>
            </div>
            {
              certificate || crl ?
                <div className="row fixed-bottom-rightcolumn" style={{ bottom: "20px" }}>
                  <div className="col s12">
                    <hr />
                  </div>
                  <div className="col s4 waves-effect waves-cryptoarm" onClick={() => certificate ? this.handleShowModalByType(MODAL_EXPORT_CERTIFICATE) : this.handleShowModalByType(MODAL_EXPORT_CRL)}>
                    <div className="col s12 svg_icon">
                      <a data-position="bottom">
                        <i className="material-icons certificate export" />
                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">{localize("Certificate.cert_export", locale)}</div>
                  </div>

                  <div className="col s4 waves-effect waves-cryptoarm" onClick={() => certificate ? this.handleShowModalByType(MODAL_DELETE_CERTIFICATE) : this.handleShowModalByType(MODAL_DELETE_CRL)}>
                    <div className="col s12 svg_icon">
                      <a data-position="bottom">
                        <i className="material-icons certificate remove" />
                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">{localize("Documents.docmenu_remove", locale)}</div>
                  </div>

                  {
                    certificate && certificate.category === REQUEST ?
                      <div className="col s4 waves-effect waves-cryptoarm" onClick={this.handleOpenCSRFolder}>
                        <div className="col s12 svg_icon">
                          <a data-position="bottom">
                            <i className="material-icons certificate csrfolder" />
                          </a>
                        </div>
                        <div className="col s12 svg_icon_text">{localize("CSR.go_to_csr_folder", locale)}</div>
                      </div> :
                      null
                  }
                </div>
                : null
            }

            {
              requestCA ?
                <div className="row fixed-bottom-rightcolumn" style={{ bottom: "20px" }}>
                  <div className="col s12">
                    <hr />
                  </div>
                  <div className="col s4 waves-effect waves-cryptoarm" onClick={() => this.handleShowModalByType(MODAL_EXPORT_REQUEST_CA)}>
                    <div className="col s12 svg_icon">
                      <a data-position="bottom">
                        <i className="material-icons ca export_request" />
                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">{localize("Certificate.cert_export", locale)}</div>
                  </div>

                  <div className="col s4 waves-effect waves-cryptoarm" onClick={() => this.handleShowModalByType(MODAL_DELETE_REQUEST_CA)}>
                    <div className="col s12 svg_icon">
                      <a data-position="bottom">
                        <i className="material-icons certificate remove" />
                      </a>
                    </div>
                    <div className="col s12 svg_icon_text">{localize("Documents.docmenu_remove", locale)}</div>
                  </div>
                </div>
                : null
            }

          </div>
          {this.showModalAddCertificate()}
          {this.showModalDeleteCertificate()}
          {this.showModalExportCertificate()}
        </div>

        <div className="fixed-action-btn" style={{ bottom: "30px", right: "380px" }} onClick={() => this.handleShowModalByType(MODAL_ADD_CERTIFICATE)}>
          <a className="btn-floating btn-large cryptoarm-red">
            <i className="large material-icons">add</i>
          </a>
        </div>
      </div>
    );
  }

  handleShowModalByType = (typeOfModal: string) => {
    switch (typeOfModal) {
      case MODAL_ADD_CERTIFICATE:
        this.setState({ showModalAddCertificate: true });
        break;
      case MODAL_DELETE_CERTIFICATE:
        this.setState({ showModalDeleteCertifiacte: true });
        break;
      case MODAL_EXPORT_CERTIFICATE:
        this.setState({ showModalExportCertifiacte: true });
        break;
      case MODAL_EXPORT_CRL:
        this.setState({ showModalExportCRL: true });
        break;
      case MODAL_DELETE_CRL:
        this.setState({ showModalDeleteCRL: true });
        break;
      default:
        return;
    }
  }

  handleCloseModalByType = (typeOfModal: string): void => {
    switch (typeOfModal) {
      case MODAL_ADD_CERTIFICATE:
        this.setState({ showModalAddCertificate: false });
        break;
      case MODAL_DELETE_CERTIFICATE:
        this.setState({ showModalDeleteCertifiacte: false });
        break;
      case MODAL_EXPORT_CERTIFICATE:
        this.setState({ showModalExportCertifiacte: false });
        break;
      case MODAL_EXPORT_CRL:
        this.setState({ showModalExportCRL: false });
        break;
      case MODAL_DELETE_CRL:
        this.setState({ showModalDeleteCRL: false });
        break;
      default:
        return;
    }
  }

  handleCloseModals = () => {
    this.setState({
      showModalDeleteCRL: false,
      showModalDeleteCertifiacte: false,
      showModalExportCRL: false,
      showModalExportCertifiacte: false,
    });
  }

  handlePasswordChange = (password: string) => {
    this.setState({ password });
  }

  handleChangeActiveTab = (certInfoTab: boolean) => {
    this.setState({
      activeCertInfoTab: certInfoTab,
    });
  }

  handleActiveCert = (certificate: any) => {
    this.setState({ certificate, crl: null, requestCA: null });
  }

  handleActiveCRL = (crl: any) => {
    this.setState({ certificate: null, requestCA: null, crl });
  }

  handleActiveRequestCA = (requestCA: any) => {
    this.setState({ certificate: null, crl: null, requestCA });
  }

  handleReloadCertificates = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { isLoading, loadAllCertificates, removeAllCertificates } = this.props;

    this.setState({ certificate: null, crl: null, requestCA: null });

    removeAllCertificates();

    if (!isLoading) {
      loadAllCertificates();
    }

    this.handleCloseModals();
  }

  handleReloadContainers = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { isLoading, loadAllContainers, removeAllContainers } = this.props;

    this.setState({
      container: null,
      deleteContainer: false,
    });

    removeAllContainers();

    if (!isLoading) {
      loadAllContainers();
    }

    this.handleCloseModals();
  }

  handleCertificateImport = (event: any) => {
    const { localize, locale } = this.context;
    // tslint:disable-next-line:no-shadowed-variable
    const { isLoading, loadAllCertificates, removeAllCertificates } = this.props;
    const path = event[0].path;
    const format: trusted.DataFormat = fileCoding(path);

    let certificate: trusted.pki.Certificate;
    let providerType: string;

    try {
      certificate = trusted.pki.Certificate.load(path, format);
    } catch (e) {
      Materialize.toast(localize("Certificate.cert_load_failed", locale), 2000, "toast-cert_load_failed");
      return;
    }

    providerType = PROVIDER_CRYPTOPRO;

    window.PKISTORE.importCertificate(certificate, providerType, (err: Error) => {
      if (err) {
        Materialize.toast(localize("Certificate.cert_import_failed", locale), 2000, "toast-cert_import_error");
      }
    }, ADDRESS_BOOK);

    Materialize.toast(localize("Certificate.cert_import_ok", locale), 2000, "toast-cert_imported");

    logger.log({
      certificate: certificate.subjectName,
      level: "info",
      message: "",
      operation: "Импорт сертификата",
      operationObject: {
        in: "CN=" + certificate.subjectFriendlyName,
        out: "Null",
      },
      userName: USER_NAME,
    });

    removeAllCertificates();

    if (!isLoading) {
      loadAllCertificates();
    }
  }

  getCertificateOrCRLInfo() {
    const { certificate, crl, requestCA } = this.state;
    const { localize, locale } = this.context;

    if (certificate) {
      return this.getCertificateInfoBody();
    } else if (crl) {
      return this.getCRLInfoBody();
    } else if (requestCA) {
      return this.getRequestCAInfoBody();
    } else {
      return <BlockNotElements name={"active"} title={localize("Certificate.cert_not_select", locale)} />;
    }
  }

  getCertificateInfoBody() {
    const { activeCertInfoTab, certificate } = this.state;
    const { localize, locale } = this.context;

    let cert: any = null;

    if (certificate && activeCertInfoTab) {
      cert = <CertificateInfo certificate={certificate} />;
    } else if (certificate) {
      cert = (
        <React.Fragment>
          <a className="collection-info chain-info-blue">{localize("Certificate.cert_chain_status", locale)}</a>
          <div className="collection-info chain-status">{certificate.status ? localize("Certificate.cert_chain_status_true", locale) : localize("Certificate.cert_chain_status_false", locale)}</div>
          <a className="collection-info chain-info-blue">{localize("Certificate.cert_chain_info", locale)}</a>
          <CertificateChainInfo certificate={certificate} key={"chain_" + certificate.id} style="" onClick={() => { return; }} />
        </React.Fragment>
      );
    }

    return (
      <div>
        <Media query="(max-height: 870px)">
          {(matches) =>
            matches ? (
              <React.Fragment>
                <CertificateInfoTabs activeCertInfoTab={this.handleChangeActiveTab} />
                <div style={{ height: "calc(100vh - 150px)" }}>
                  <div className="add-certs">
                    {cert}
                  </div>
                </div>
              </ React.Fragment>
            ) :
              <React.Fragment>
                <div className="col s12">
                  <div className="primary-text">Сведения о сертификате:</div>
                  <hr />
                </div>
                <div className="col s12" style={{ padding: 0 }}>
                  <div style={{ height: "calc(100vh - 150px)" }}>
                    <div className="add-certs">
                      <CertificateInfo certificate={certificate} />
                      <a className="collection-info chain-info-blue">{localize("Certificate.cert_chain_info", locale)}</a>
                      <CertificateChainInfo certificate={certificate} key={"chain_" + certificate.id} style="" onClick={() => { return; }} />
                    </div>
                  </div>
                </div>
              </React.Fragment>
          }
        </Media>
      </div>
    );
  }

  getCRLInfoBody() {
    const { crl } = this.state;

    return (
      <div className="add-certs">
        <CRLInfo crl={crl} />
      </div>
    );
  }

  getRequestCAInfoBody() {
    const { requestCA } = this.state;

    return (
      <div className="add-certs">
        <RequestCAInfo requestCA={requestCA} handleReloadCertificates={this.handleReloadCertificates} />
      </div>
    );
  }

  getTitle() {
    const { certificate, crl } = this.state;
    const { localize, locale } = this.context;

    let title: any = null;

    if (certificate) {
      title = <div className="cert-title-main">
        <div className="collection-title cert-title">{certificate.subjectFriendlyName}</div>
        <div className="collection-info cert-title">{certificate.issuerFriendlyName}</div>
      </div>;
    } else if (crl) {
      title = (
        <div className="cert-title-main">
          <div className="collection-title cert-title">{crl.issuerFriendlyName}</div>
        </div>);
    } else {
      title = <span>{localize("Certificate.cert_info", locale)}</span>;
    }

    return title;
  }

  showModalAddCertificate = () => {
    const { localize, locale } = this.context;
    const { showModalAddCertificate } = this.state;
    const { location } = this.props;

    if (!showModalAddCertificate) {
      return;
    }

    return (
      <Modal
        isOpen={showModalAddCertificate}
        header={localize("Certificate.cert_import", locale)}
        onClose={() => this.handleCloseModalByType(MODAL_ADD_CERTIFICATE)}
        style={{ width: "350px" }}>

        <AddCertificate
          certImport={this.certImport}
          handleShowModalByType={this.handleShowModalByType}
          location={location}
          onCancel={() => this.handleCloseModalByType(MODAL_ADD_CERTIFICATE)} />
      </Modal>
    );
  }

  showModalDeleteCertificate = () => {
    const { localize, locale } = this.context;
    const { certificate, showModalDeleteCertifiacte } = this.state;

    if (!certificate || !showModalDeleteCertifiacte) {
      return;
    }

    return (
      <Modal
        isOpen={showModalDeleteCertifiacte}
        header={localize("Certificate.delete_certificate", locale)}
        onClose={() => this.handleCloseModalByType(MODAL_DELETE_CERTIFICATE)}>

        <CertificateDelete
          certificate={certificate}
          onCancel={() => this.handleCloseModalByType(MODAL_DELETE_CERTIFICATE)}
          reloadCertificates={this.handleReloadCertificates}
          reloadContainers={this.handleReloadContainers} />
      </Modal>
    );
  }

  showModalExportCertificate = () => {
    const { localize, locale } = this.context;
    const { certificate, showModalExportCertifiacte } = this.state;

    if (!certificate || !showModalExportCertifiacte) {
      return;
    }

    return (
      <Modal
        isOpen={showModalExportCertifiacte}
        header={localize("Export.export_certificate", locale)}
        onClose={() => this.handleCloseModalByType(MODAL_EXPORT_CERTIFICATE)}>

        <CertificateExport
          certificate={certificate}
          onSuccess={() => this.handleCloseModalByType(MODAL_EXPORT_CERTIFICATE)}
          onCancel={() => this.handleCloseModalByType(MODAL_EXPORT_CERTIFICATE)}
          onFail={() => this.handleCloseModalByType(MODAL_EXPORT_CERTIFICATE)} />
      </Modal>
    );
  }

  handleSearchValueChange = (ev: any) => {
    // tslint:disable-next-line:no-shadowed-variable
    const { changeSearchValue } = this.props;
    changeSearchValue(ev.target.value);
  }

  certImport = () => {
    const CLICK_EVENT = document.createEvent("MouseEvents");

    CLICK_EVENT.initEvent("click", true, true);
    document.querySelector("#choose-cert").dispatchEvent(CLICK_EVENT);
  }

  handleOpenCSRFolder = () => {
    window.electron.shell.openItem(DEFAULT_CSR_PATH);
  }
}

export default connect((state) => {
  return {
    certificates: filteredCertificatesSelector(state, { operation: "address_book" }),
    containersLoading: state.containers.loading,
    crls: filteredCrlsSelector(state),
    isLoading: state.certificates.loading,
    isLoadingFromDSS: state.cloudCSP.loading,
    location: state.router.location,
    searchValue: state.filters.searchValue,
    servicesMap: state.services.entities,
  };
}, {
  changeSearchValue, loadAllCertificates, loadAllContainers,
  removeAllCertificates, removeAllContainers})(AddressBookWindow);
