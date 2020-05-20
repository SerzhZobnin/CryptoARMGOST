import PropTypes from "prop-types";
import React from "react";
import {
  ADDRESS_BOOK, CA, MODAL_CERTIFICATE_IMPORT_DSS, MODAL_CERTIFICATE_REQUEST,
  MODAL_CERTIFICATE_REQUEST_CA, MY, REQUEST, ROOT, INTERRUPT, URL_CMD_CERTIFICATES_IMPORT,
} from "../../constants";
import store from "../../store";

interface IBestStoreProps {
  autoImport: () => void;
  bestStore: string;
  currentStore: string;
  importToCurrent: () => void;
  onCancel: () => void;
  isImportFromUrlCmd: boolean;
}

interface IBestStoreState {
  autoChooseStore: boolean;
}

class BestStore extends React.Component<IBestStoreProps, IBestStoreState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: IBestStoreProps) {
    super(props);

    this.state = ({
      autoChooseStore: !props.isImportFromUrlCmd,
    });
  }

  componentWillUnmount() {
    this.handelCancel(false);
  }

  render() {
    const { localize, locale } = this.context;
    const { bestStore, currentStore, isImportFromUrlCmd } = this.props;

    return (
      <React.Fragment>
        <div className="row halftop">
          <div className="col s12">
            <div className="content-wrapper tbody border_group">
            <div className="col s12">
              Вы хотите установить сертификат в хранилище "{localize(`CertificateStore.${currentStore}`, locale)}", но КриптоАРМ обнаружил, что
              лучше подойдет "{localize(`CertificateStore.${bestStore}`, locale)}"
              </div>
              <div className="row">
                <div className="col s12">
                  <form action="#">
                    <p>
                      <input name="autoChooseStore" type="radio" id="isAutoChooseStore"
                        disabled={isImportFromUrlCmd}
                        checked={this.state.autoChooseStore}
                        onClick={() => this.handleAutoChooseStore(true)} />
                      <label htmlFor="isAutoChooseStore" className="secondary-text" >
                        {localize("Certificate.cert_import_auto", locale)}
                      </label>
                    </p>
                    <p>
                      <input name="autoChooseStore" type="radio" id="isNotAutoChooseStor"
                        checked={!this.state.autoChooseStore}
                        onClick={() => this.handleAutoChooseStore(false)} />
                      <label htmlFor="isNotAutoChooseStor" className="secondary-text">
                        {localize("Certificate.cert_import_current", locale)}
                      </label>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row halfbottom" />

        <div className="row halfbottom">
          <div style={{ float: "right" }}>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className="btn btn-outlined waves-effect waves-light modal-close" onClick={this.handelCancel}>{localize("Common.cancel", locale)}</a>
            </div>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className={"btn btn-outlined waves-effect waves-light modal-close "} onClick={this.handleReady}>{localize("Common.ready", locale)}</a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleAutoChooseStore = (auto: boolean) => {
    this.setState({ autoChooseStore: auto });
  }

  handleReady = () => {
    const { autoChooseStore } = this.state;

    if (autoChooseStore) {
      this.props.autoImport();
    } else {
      this.props.importToCurrent();
    }

    this.handelCancel(false);
  }

  handelCancel = (interruptUrlCmd: boolean = true) => {
    const { onCancel, isImportFromUrlCmd } = this.props;

    if (interruptUrlCmd && isImportFromUrlCmd) {
      store.dispatch({type: URL_CMD_CERTIFICATES_IMPORT + INTERRUPT});
    }

    if (onCancel) {
      onCancel();
    }
  }
}

export default BestStore;
