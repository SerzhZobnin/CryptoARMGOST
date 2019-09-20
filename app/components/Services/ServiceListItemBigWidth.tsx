import PropTypes from "prop-types";
import React from "react";

const rectangleValidStyle = {
  background: "#4caf50",
};

const rectangleUnvalidStyle = {
  background: "#bf3817",
};

interface IServiceListItemProps {
  chooseCert: () => void;
  isOpen: boolean;
  toggleOpen: () => void;
  service: any;
}

class ServiceListItemBigWidth extends React.Component<IServiceListItemProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  timerHandle: NodeJS.Timer | null;

  componentWillUnmount() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = null;
    }
  }

  render() {
    const { locale, localize } = this.context;
    const { service, isOpen } = this.props;

    let active = "";
    let curStatusStyle = "cert_status_ok";

    if (isOpen) {
      active = "active";
    }

    return (
      <div className="row certificate-list-item">
        <div className={"collection-item avatar certs-collection " + active} onClick={this.handleClick}>
          <div className="row nobottom valign-wrapper">
            <div className="col s1">
              <div className={curStatusStyle} />
            </div>
            <div className="col s5">
              <div className="collection-title">{service.name}</div>
            </div>
            <div className="col s3">
              <div className="collection-info cert-info ">{service.url}</div>
            </div>
            <div className="col s3">
              <div className="collection-info cert-info ">{service.field}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleClick = () => {
    const { chooseCert, toggleOpen } = this.props;

    chooseCert();
    toggleOpen();
  }
}
export default (ServiceListItemBigWidth);
