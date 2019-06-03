import PropTypes from "prop-types";
import React from "react";
import { USER_NAME } from "../../constants";
import logger from "../../winstonLogger";

interface IContainerDeleteProps {
  container: any;
  onCancel?: () => void;
  reloadContainers: () => void;
}

class ContainerDelete extends React.Component<IContainerDeleteProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  componentWillUnmount() {
    this.handelCancel();
  }

  render() {
    const { localize, locale } = this.context;

    return (
      <React.Fragment>
        <div className="row">
          <div className="col s12">
            <span className="card-infos sub">
              {localize("Containers.realy_delete_container", locale)}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col s5 offset-s7">
            <div className="row nobottom">
              <div className="col s6">
                <a className={"waves-effect waves-light btn modal-close"} onClick={this.handelCancel}>{localize("Common.cancel", locale)}</a>
              </div>
              <div className="col s6">
                <a className="waves-effect waves-light btn modal-close" onClick={this.handleRemove}>{localize("Common.delete", locale)}</a>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  handelCancel = () => {
    const { onCancel } = this.props;

    if (onCancel) {
      onCancel();
    }
  }

  handleRemove = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { container, reloadContainers } = this.props;
    const { localize, locale } = this.context;

    if (!container) {
      return;
    }

    try {
      trusted.utils.Csp.deleteContainer(container.name, 75);

      $(".toast-container_delete_ok").remove();
      Materialize.toast(localize("Containers.container_delete_ok", locale), 2000, "toast-container_delete_ok");

      logger.log({
        certificate: "",
        level: "info",
        message: "",
        operation: "Удаление контейнера",
        operationObject: {
          in: container.name,
          out: "Null",
        },
        userName: USER_NAME,
      });

      reloadContainers();
    } catch (err) {
      $(".toast-container_delete_failed").remove();
      Materialize.toast(localize("Containers.container_delete_failed", locale), 2000, "toast-container_delete_failed");

      logger.log({
        certificate: "",
        level: "error",
        message: err.message ? err.message : err,
        operation: "Удаление контейнера",
        operationObject: {
          in: container,
          out: "Null",
        },
        userName: USER_NAME,
      });
    }
  }
}

export default ContainerDelete;
