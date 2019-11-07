import PropTypes from "prop-types";
import React from "react";
import Media from "react-media";
import { connect } from "react-redux";
import { AutoSizer, List } from "react-virtualized";
import { loadAllCertificates, verifyCertificate } from "../../AC";
import accordion from "../../decorators/accordion";
import { filteredCertificatesSelector } from "../../selectors";
import { filteredCrlsSelector } from "../../selectors/crlsSelectors";
import { filteredRequestCASelector } from "../../selectors/requestCASelector";
import CRLListItem from "../CRL/CRLListItem";
import ProgressBars from "../ProgressBars";
import RequestCAListItem from "../Request/RequestCAListItem";
import CertificateListItem from "./CertificateListItem";
import CertificateListItemBigWidth from "./CertificateListItemBigWidth";

const HEIGHT_MODAL = 356;
const HEIGHT_FULL = 432;
const ROW_HEIGHT = 45;

interface ICertificateListProps {
  activeCert: (certificate: any) => void;
  activeCrl: (crl: any) => void;
  activeRequestCA: (requestCA: any) => void;
  certificates: any;
  crls: any;
  isLoaded: boolean;
  isLoading: boolean;
  operation: string;
  certrequests: any;
  loadAllCertificates: () => void;
  verifyCertificate: (id: number) => void;
}

class CertificateList extends React.Component<ICertificateListProps, any> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: ICertificateListProps) {
    super(props);

    this.state = ({
      activeSection: "my",
      countSections: 0,
    });
  }

  componentDidMount() {
    // tslint:disable-next-line:no-shadowed-variable
    const { isLoaded, isLoading, loadAllCertificates } = this.props;

    if (!isLoading && !isLoaded) {
      loadAllCertificates();
    }

    $(".collapsible").collapsible();
  }

  render() {
    const { certificates, crls, isLoading, operation, certrequests } = this.props;
    const { localize, locale } = this.context;

    if (isLoading) {
      return <ProgressBars />;
    }

    const my: object[] = [];
    const root: object[] = [];
    const intermediate: object[] = [];
    const other: object[] = [];
    const token: object[] = [];
    const request: object[] = [];

    certificates.forEach((cert: any) => {
      switch (cert.category) {
        case "MY":
          return my.push(cert);
        case "ROOT":
          return root.push(cert);
        case "CA":
          return intermediate.push(cert);
        case "AddressBook":
          return other.push(cert);
        case "TOKEN":
          return token.push(cert);
        case "Request":
          return request.push(cert);
      }
    });

    let count = -1;

    if (my.length) {
      count++;
    }

    if (root.length) {
      count++;
    }

    if (other.length) {
      count++;
    }

    if (token.length) {
      count++;
    }

    if (request.length) {
      count++;
    }

    if (crls.length && (operation === "certificate")) {
      count++;
      count++;
    } else {
      count++;
    }

    if (certrequests.length && (operation === "certificate")) {
      count++;
    }

    return (
      <React.Fragment>
        <ul className="collapsible" data-collapsible="accordion">
          {this.getCollapsibleElement(localize("Certificate.certs_my", locale), "my", my, count, true)}
          {this.getCollapsibleElement(localize("Certificate.certs_other", locale), "other", other, count)}
          {this.getCollapsibleElement(localize("Certificate.certs_intermediate", locale), "intermediate", intermediate, count)}
          {this.getCollapsibleElement(localize("Certificate.certs_root", locale), "root", root, count)}
          {this.getCollapsibleElement(localize("Certificate.certs_token", locale), "token", token, count)}
          {this.getCollapsibleElement(localize("Certificate.certs_request", locale), "request", request, count)}
          {(operation === "certificate") ? this.getCollapsibleElementRequestCA("Запросы отправленные в УЦ", "ca", certrequests, count) : null}
          {(operation === "certificate") ? this.getCollapsibleElementCRL(localize("Certificate.crls", locale), "intermediate", crls, count) : null}
        </ul>
      </React.Fragment>
    );
  }

  getCollapsibleElement = (head: string, name: string, elements: object[], count: number, active: boolean = false) => {
    const { activeCert, operation, toggleOpenItem, isItemOpened } = this.props;

    if (!elements || elements.length === 0) {
      return null;
    }

    const activeSection = active ? "active" : "";

    return (
      <li>
        <div className={`collapsible-header color ${activeSection}`} onClick={() => this.setState({ activeSection: name })}>
          <i className={`material-icons left ${name}`}>
          </i>
          {head}
        </div>
        <div className="collapsible-body">
          <div style={{ display: "flex" }}>
            <div style={{ flex: "1 1 auto", height: `calc(100vh - 170px - ${45 * count}px)` }}>
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    height={height}
                    overscanRowCount={1}
                    rowCount={elements.length}
                    rowHeight={ROW_HEIGHT}
                    rowRenderer={({ index, key, style }) => {
                      if (!elements.length || this.state.activeSection !== name) {
                        return null;
                      }

                      const cert = elements[index];

                      return (
                        <ul
                          key={key}
                          style={style}
                        >
                          <Media query="(max-width: 1020px)">
                            {(matches) =>
                              matches ? (
                                <CertificateListItem
                                  key={cert.id}
                                  cert={cert}
                                  chooseCert={() => activeCert(cert)}
                                  operation={operation}
                                  isOpen={isItemOpened(cert.id.toString())}
                                  toggleOpen={toggleOpenItem(cert.id.toString())}
                                  style={style} />
                              ) : <CertificateListItemBigWidth
                                  key={cert.id}
                                  cert={cert}
                                  chooseCert={() => activeCert(cert)}
                                  operation={operation}
                                  isOpen={isItemOpened(cert.id.toString())}
                                  toggleOpen={toggleOpenItem(cert.id.toString())}
                                  style={style} />
                            }
                          </Media>
                        </ul>
                      );
                    }}
                    width={width}
                  />
                )}
              </AutoSizer>
            </div>
          </div>
        </div>
      </li>
    );
  }

  getCollapsibleElementCRL = (head: string, name: string, elements: object[], count: number, active: boolean = false) => {
    const { activeCrl, operation, toggleOpenItem, isItemOpened } = this.props;

    if (!elements || elements.length === 0) {
      return null;
    }

    const activeSection = active ? "active" : "";

    return (
      <li>
        <div className={`collapsible-header color ${activeSection}`} onClick={() => this.setState({ activeSection: name })}>
          <i className={`material-icons left ${name}`}>
          </i>
          {head}
        </div>
        <div className="collapsible-body">
          <div style={{ display: "flex" }}>
            <div style={{ flex: "1 1 auto", height: `calc(100vh - 170px - ${45 * count}px)` }}>
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    height={height}
                    overscanRowCount={1}
                    rowCount={elements.length}
                    rowHeight={ROW_HEIGHT}
                    rowRenderer={({ index, key, style }) => {
                      if (!elements.length || this.state.activeSection !== name) {
                        return null;
                      }

                      const cert = elements[index];

                      return (
                        <ul
                          key={key}
                          style={style}
                        >
                          <CRLListItem
                            key={cert.id}
                            crl={cert}
                            chooseCert={() => activeCrl(cert)}
                            operation={operation}
                            isOpen={isItemOpened(cert.id.toString())}
                            toggleOpen={toggleOpenItem(cert.id.toString())} />
                        </ul>
                      );
                    }}
                    width={width}
                  />
                )}
              </AutoSizer>
            </div>
          </div>
        </div>
      </li>
    );
  }

  getCollapsibleElementRequestCA = (head: string, name: string, elements: object[], count: number, active: boolean = false) => {
    const { activeRequestCA, operation, toggleOpenItem, isItemOpened } = this.props;

    if (!elements || elements.length === 0) {
      return null;
    }

    const activeSection = active ? "active" : "";

    return (
      <li>
        <div className={`collapsible-header color ${activeSection}`} onClick={() => this.setState({ activeSection: name })}>
          <i className={`material-icons left ${name}`}>
          </i>
          {head}
        </div>
        <div className="collapsible-body">
          <div style={{ display: "flex" }}>
            <div style={{ flex: "1 1 auto", height: `calc(100vh - 170px - ${45 * count}px)` }}>
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    height={height}
                    overscanRowCount={1}
                    rowCount={elements.length}
                    rowHeight={ROW_HEIGHT}
                    rowRenderer={({ index, key, style }) => {
                      if (!elements.length || this.state.activeSection !== name) {
                        return null;
                      }

                      const request = elements[index];

                      return (
                        <ul
                          key={key}
                          style={style}
                        >
                          <RequestCAListItem
                            key={request.id}
                            requestCA={request}
                            service={this.props.services.getIn(["entities", request.serviceId])}
                            chooseCert={() => activeRequestCA(request)}
                            operation={operation}
                            isOpen={isItemOpened(request.id.toString())}
                            toggleOpen={toggleOpenItem(request.id.toString())} />
                        </ul>
                      );
                    }}
                    width={width}
                  />
                )}
              </AutoSizer>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

interface IOwnProps {
  operation: string;
}

export default connect((state, ownProps: IOwnProps) => {
  return {
    certificates: filteredCertificatesSelector(state, { operation: ownProps.operation }),
    crls: filteredCrlsSelector(state),
    isLoaded: state.certificates.loaded,
    isLoading: state.certificates.loading,
    certrequests: filteredRequestCASelector(state),
    services: state.services,
  };
}, { loadAllCertificates, verifyCertificate }, null, { pure: false })(accordion(CertificateList));
