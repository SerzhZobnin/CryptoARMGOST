import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { loadAllCertificates, removeAllCertificates } from "../../AC";
import { getCertRequest, getCertRequestStatus } from "../../AC/caActions";
import { DEFAULT_CERTSTORE_PATH, HOME_DIR, MY, PROVIDER_CRYPTOPRO, REQUEST_STATUS } from "../../constants";
import { filteredRequestCASelector } from "../../selectors/requestCASelector";

interface IRequestCAInfoProps {
  requestCA: any;
}

class RequestCAInfo extends React.Component<IRequestCAInfoProps, any> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  componentDidMount() {
    const { certRequest, regrequests, servicesMap, getCertRequestStatus, } = this.props;
    const service = servicesMap.find((obj: any) => obj.get("id") === certRequest.serviceId);
    const regrequest = regrequests.find((obj: any) => obj.get("serviceId") === certRequest.serviceId);
    getCertRequestStatus(`${service.settings.url}`, certRequest, regrequest);
  }

  componentDidUpdate(prevProps: any) {
    const { certRequest, regrequests, servicesMap, getCertRequest, request } = this.props;
    const { localize, locale } = this.context;
    if ((request.status !== prevProps.request.status) && (request.status === REQUEST_STATUS.C)) {
      const service = servicesMap.find((obj: any) => obj.get("id") === certRequest.serviceId);
      const regrequest = regrequests.find((obj: any) => obj.get("serviceId") === certRequest.serviceId);
      getCertRequest(`${service.settings.url}`, certRequest, regrequest);
    }

    if ((certRequest.certificate !== prevProps.certRequest.certificate) && (certRequest.certificate)) {
      const cert = new trusted.pki.Certificate();
      cert.import(new Buffer(certRequest.certificate), trusted.DataFormat.PEM);
      const containerName = trusted.utils.Csp.getContainerNameByCertificate(cert);
      window.PKISTORE.importCertificate(cert, PROVIDER_CRYPTOPRO, (err: Error) => {
        if (err) {
          Materialize.toast(localize("Certificate.cert_import_failed", locale), 2000, "toast-cert_import_error");
        }
      }, MY, containerName);

      trusted.utils.Csp.installCertificateToContainer(cert, containerName, 75);

      this.handleReloadCertificates();
    }
  }

  render() {
    const { localize, locale } = this.context;
    const { request } = this.props;

    return (
      <React.Fragment>
        <div className="col s12">
          <div className="desktoplic_text_item">{localize("CA.request_status", locale)}</div>
          <hr />
        </div>

        <div className="col s12">
          <div className="collection cert-info-list">
            <div className="collection-item certs-collection certificate-info">
              <div className={"collection-info cert-info-blue"}>{localize("CA.current_status", locale)}</div>
              <div className={"collection-title selectable-text"}>{request.status}</div>
            </div>
          </div>
        </div>

        <div className="row" />

        <div className="col s12">
          <div className="desktoplic_text_item">{localize("CA.request_info", locale)}</div>
          <hr />
        </div>

        <div className="col s12">
          <div className="collection cert-info-list">
            {this.getRequestInfo()}
          </div>
        </div>
      </React.Fragment>
    );
  }

  getRequestInfo = () => {
    const { request } = this.props;

    if (!request || !request.subject || !request.subject.length) {
      return null;
    }

    return request.subject.map((field: any) => {
      return (
        <div className="collection-item certs-collection certificate-info">
          <div className={"collection-info cert-info-blue"}>{field.type}</div>
          <div className={"collection-title selectable-text"}>{field.value ? field.value : "-"}</div>
        </div>
      );
    });
  }

  handleReloadCertificates = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { certificateLoading, loadAllCertificates, removeAllCertificates } = this.props;

    removeAllCertificates();

    if (!certificateLoading) {
      loadAllCertificates();
    }
  }
}


export default connect((state, ownProps) => {
  const request = state.certrequests.getIn(["entities", ownProps.requestCA.id]);
  return {
    request,
    certificateLoading: state.certificates.loading,
    certrequests: filteredRequestCASelector(state),
    regrequests: state.regrequests.entities,
    servicesMap: state.services.entities,
    certRequest: filteredRequestCASelector(state).find((obj: any) => obj.get("id") === request.id),
  };
}, {
  getCertRequest, getCertRequestStatus, loadAllCertificates, removeAllCertificates,
})(RequestCAInfo);
