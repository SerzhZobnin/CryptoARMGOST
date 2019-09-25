import { Map } from "immutable";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { addService } from "../../AC/servicesActions";
import { CA_SERVICE } from "../../constants";
import { uuid } from "../../utils";
import CryptoProCASettings from "../CA/CryptoProCASettings";
import DynamicRegistrationForm from "../CA/DynamicRegistrationForm";
import LoginForm from "../CA/LoginForm";
import { ICAServiceSettings, IService } from "./types";

interface IAddServiceState {
  activeSettingsTab: boolean;
  isUserattrLoading: boolean;
  regNewUser: boolean;
  serviceName: string;
  serviceType: "CA_SERVICE";
  serviceSettings: ICAServiceSettings;
  RDN: any;
}

const initialState = {
  activeSettingsTab: true,
  isUserattrLoading: false,
  regNewUser: true,
  serviceName: "КриптоПро УЦ 2.0",
  serviceSettings: {
    url: "https://testca2012.cryptopro.ru/ui/api/b1ca4992-d7cd-4f7e-b56e-a81e00db58ee",
  },
  serviceType: CA_SERVICE,
  RDN: null,
};

interface IAddServiceProps {
  addService: (service: IService) => void;
  mapServices: Map<any, any>;
  onCancel: (service?: IService) => void;
}

class AddService extends React.Component<IAddServiceProps, IAddServiceState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: IAddServiceProps) {
    super(props);

    this.state = { ...initialState };
  }

  componentDidMount() {
    Materialize.updateTextFields();
  }

  componentDidUpdate() {
    Materialize.updateTextFields();
  }

  componentWillUnmount() {
    this.handelCancel();
  }

  render() {
    const { localize, locale } = this.context;
    const { activeSettingsTab, regNewUser, serviceType, serviceSettings } = this.state;

    return (
      <div className="add_new_service_modal">
        <div className="row halftop">
          <div className="col s12">
            <div className="content-wrapper tbody  border_group" style={{
              boxshadow: "0 0 0 1px rgb(227, 227, 228)",
              height: "400px",
              overflow: "auto",
            }}>
              {
                activeSettingsTab ?
                  <div className="row">
                    <div className="row">
                      <div className="col s12">
                        <p className="label-csr">
                          {localize("Services.service_type", locale)}
                        </p>
                        <form action="#">
                          <p>
                            <input name="serviceType" type="radio"
                              checked={serviceType === CA_SERVICE}
                              id={CA_SERVICE}
                              onClick={() => this.handleChangeServiceType(CA_SERVICE)} />
                            <label htmlFor={CA_SERVICE}>
                              {localize("CA.cryptopro_ca", locale)}
                            </label>
                          </p>
                        </form>
                      </div>
                    </div>
                    <div className="row">
                      {this.getServiceSettings()}
                    </div>
                  </div>
                  :
                  <div className="row">
                    <div className="row" />
                    {
                      regNewUser ?
                        <DynamicRegistrationForm caURL={serviceSettings.url} onCancel={this.handelCancel} />
                        : <LoginForm />
                    }
                  </div>
              }
            </div>

            <div className="row halfbottom" />

            {
              activeSettingsTab ?
                <div className="row halfbottom">
                  <div style={{ float: "right" }}>
                    <div style={{ display: "inline-block", margin: "10px" }}>
                      <a className={"btn btn-text waves-effect waves-light modal-close "} onClick={this.handelCancel}>{localize("Common.cancel", locale)}</a>
                    </div>
                    <div style={{ display: "inline-block", margin: "10px" }}>
                      <a className={"btn btn-outlined waves-effect waves-light"} onClick={this.handleAdd}>{localize("Services.connect", locale)}</a>
                    </div>
                  </div>
                </div>
                :
                <div className="row halfbottom">
                  <div style={{ float: "right" }}>
                    <div style={{ display: "inline-block", margin: "10px" }}>
                      <a className={"btn btn-outlined waves-effect waves-light"} onClick={this.handleCAUserRegrequest}>{localize("Services.connect", locale)}</a>
                    </div>
                  </div>
                </div>
            }
          </div>
        </div>
      </div>
    );
  }

  getServiceSettings = () => {
    const { regNewUser, serviceName, serviceType, serviceSettings } = this.state;
    const { localize, locale } = this.context;

    switch (serviceType) {
      case CA_SERVICE:
        return (
          <React.Fragment>
            <CryptoProCASettings
              nameChange={this.handleServiceNameChange}
              urlChange={this.handleCAUrlChange}
              service={{ settings: serviceSettings, name: serviceName }}
            />
            <div className="col s12">
              <div className="input-checkbox">
                <input
                  name="regNewUser"
                  type="checkbox"
                  id="regNewUser"
                  className="filled-in"
                  checked={regNewUser}
                  onClick={this.toggleRegNewUser}
                />
                <label htmlFor={"regNewUser"} className="truncate">
                  {localize("CA.reg_new_user", locale)}
                </label>
              </div>
            </div>
          </React.Fragment>
        );

      default:
        return null;
    }
  }

  toggleRegNewUser = () => {
    this.setState({ regNewUser: !this.state.regNewUser });
  }

  handleServiceNameChange = (ev: any) => {
    this.setState({ serviceName: ev.target.value });
  }

  handleCAUrlChange = (ev: any) => {
    this.setState({ serviceSettings: { ...this.state.serviceSettings, url: ev.target.value } });
  }

  handleChangeServiceType = (type: "CA_SERVICE") => {
    this.setState({ serviceType: type });

    return;
  }

  handleAdd = () => {
    const { serviceType } = this.state;

    if (serviceType === CA_SERVICE) {
      this.setState({ activeSettingsTab: false });
      return;
    }
  }

  handelCancel = () => {
    const { onCancel } = this.props;

    if (onCancel) {
      onCancel();
    }
  }

  handleCAUserRegrequest = (model: any) => {
    // tslint:disable-next-line:no-shadowed-variable
    const { addService, onCancel } = this.props;
    const { serviceName, serviceSettings, serviceType } = this.state;

    const id = uuid();
    const service: IService = {
      id,
      name: serviceName,
      settings: serviceSettings,
      type: serviceType,
    };

    addService(service);
    // getCertificates(serviceSettings.authURL, serviceSettings.restURL, token);
    onCancel(service);
  }
}

export default connect((state) => ({
  mapServices: state.services,
}), { addService })(AddService);
