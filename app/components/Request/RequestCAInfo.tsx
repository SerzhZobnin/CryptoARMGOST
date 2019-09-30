import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { getCertRequestStatus } from "../../AC/caActions";
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
    const { certrequests, regrequests, servicesMap, getCertRequestStatus, request } = this.props;
    const certRequest = certrequests.find((obj: any) => obj.get("id") === request.id);
    const service = servicesMap.find((obj: any) => obj.get("id") === certRequest.serviceId);
    const regrequest = regrequests.find((obj: any) => obj.get("serviceId") === certRequest.serviceId);
    getCertRequestStatus(`${service.settings.url}`, certRequest, regrequest);
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
      </React.Fragment>
    );
  }
}

export default connect((state, ownProps) => {
  console.log(ownProps);
  return {
    request: state.certrequests.getIn(["entities", ownProps.requestCA.id]),
    certrequests: filteredRequestCASelector(state),
    regrequests: state.regrequests.entities,
    servicesMap: state.services.entities,
  };
}, {getCertRequestStatus,
})(RequestCAInfo);
