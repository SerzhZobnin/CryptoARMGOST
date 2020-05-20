import PropTypes from "prop-types";
import React from "react";
import Media from "react-media";
import { connect } from "react-redux";
import {
  loadAllCertificates, removeAllCertificates, selectSignerCertificate,
} from "../../AC";
import { changeSearchValue } from "../../AC/searchActions";
import { filteredCertificatesSelector } from "../../selectors";
import BlockNotElements from "../BlockNotElements";
import ProgressBars from "../ProgressBars";
import CertificateChainInfo from "./CertificateChainInfo";
import CertificateInfo from "./CertificateInfo";
import CertificateInfoTabs from "./CertificateInfoTabs";
import CertificateList from "./CertificateList";
import { URL_CMD_CERTIFICATES_EXPORT } from "../../constants";
import { urlCmdSendCert, urlCmdCertExportFail } from "../../AC/urlCmdCertificates";

class CertificateSelectionForSignature extends React.Component<any, any> {
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
    });
  }

  componentDidMount() {
    $(".btn-floated").dropdown();
  }

  componentDidUpdate(prevProps, prevState) {
    const { isLoading } = this.props;
    const { certificate } = this.state;

    if ((!prevState.certificate && certificate)) {
      $(".nav-small-btn").dropdown();
    }

    if (prevProps.isLoading && !isLoading) {
      $(".btn-floated").dropdown();
    }
  }

  render() {
    const { certificates, isLoading, isLoadingFromDSS, searchValue } = this.props;
    const { certificate } = this.state;
    const { localize, locale } = this.context;

    if (isLoading || isLoadingFromDSS) {
      return <ProgressBars />;
    }

    const VIEW = certificates.size < 1 ? "not-active" : "";

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
            </div>
            <div className="add-certs">
              <div className={"collection " + VIEW}>
                <div className="row">
                  <div className="col s12">
                    <div style={{ display: "flex" }}>
                      <div style={{ flex: "1 1 auto", height: "calc(100vh - 140px)" }}>
                        {
                          certificates.size < 1 ?
                            <BlockNotElements name={"active"} title={localize("Certificate.cert_not_found", locale)} /> :
                            <CertificateList
                              selectedCert={this.state.certificate}
                              activeCert={this.handleActiveCert}
                              operation="sign" />
                        }
                      </div>
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
                <div className="primary-text">Сертификат подписи</div>
                <hr />
              </div>
              <div className="col s12">
                <div style={{ height: "calc(100vh - 120px)" }}>
                  {this.getCertificateOrCRLInfo()}
                </div>
              </div>
            </div>
            <div className="row fixed-bottom-rightcolumn">
              <div className="col s6 offset-s1">
                <a className="btn btn-text waves-effect waves-light" onClick={this.handleCancel}>
                  ОТМЕНА
                </a>
              </div>
              <div className="col s2">
                <a className="btn btn-outlined waves-effect waves-light" onClick={this.handleChooseSigner}>
                  {localize("Settings.Choose", locale)}
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  handleChangeActiveTab = (certInfoTab: boolean) => {
    this.setState({
      activeCertInfoTab: certInfoTab,
    });
  }

  handleActiveCert = (certificate: any) => {
    this.setState({ certificate, crl: null });
  }

  getCertificateOrCRLInfo() {
    const { certificate } = this.state;
    const { localize, locale } = this.context;

    if (certificate) {
      return this.getCertificateInfoBody();
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

  handleReloadCertificates = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { isLoading, loadAllCertificates, removeAllCertificates } = this.props;

    this.setState({ certificate: null });

    removeAllCertificates();

    if (!isLoading) {
      loadAllCertificates();
    }
  }

  handleChooseSigner = () => {
    // tslint:disable-next-line: no-shadowed-variable
    const { selectSignerCertificate } = this.props;
    const { certificate } = this.state;
    const { urlCmdProps } = this.props;

    if (urlCmdProps && !urlCmdProps.done
      && (urlCmdProps.operation == URL_CMD_CERTIFICATES_EXPORT)
    ) {
      urlCmdSendCert(certificate, urlCmdProps.id, urlCmdProps.url);
    } else {
      selectSignerCertificate(certificate.id);
    }

    this.props.history.goBack();
  }

  handleCancel = () => {
    const { urlCmdProps } = this.props;

    if (urlCmdProps && !urlCmdProps.done
      && (urlCmdProps.operation == URL_CMD_CERTIFICATES_EXPORT)
    ) {
      urlCmdCertExportFail();
    }

    this.props.history.goBack();
  }

  handleSearchValueChange = (ev: any) => {
    // tslint:disable-next-line:no-shadowed-variable
    const { changeSearchValue } = this.props;
    changeSearchValue(ev.target.value);
  }
}

export default connect((state) => {
  return {
    certificates: filteredCertificatesSelector(state, { operation: "sign" }),
    isLoading: state.certificates.loading,
    isLoadingFromDSS: state.cloudCSP.loading,
    searchValue: state.filters.searchValue,
    urlCmdProps: state.urlCmdCertificates,
  };
}, {
  changeSearchValue, loadAllCertificates,
  removeAllCertificates, selectSignerCertificate,
})(CertificateSelectionForSignature);
