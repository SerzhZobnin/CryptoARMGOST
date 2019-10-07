import { Map } from "immutable";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { getRegRequest, postRegRequest } from "../../AC/caActions";
import { addService } from "../../AC/servicesActions";
import { CA_SERVICE } from "../../constants";
import { uuid } from "../../utils";
import CryptoProCASettings from "../CA/CryptoProCASettings";
import DynamicRegistrationForm from "../CA/DynamicRegistrationForm";
import LoginForm from "../CA/LoginForm";
import { ICAServiceSettings, IService } from "./types";

interface IAddServiceState {
  activeSettingsTab: boolean;
  comment: string;
  description: string;
  email: string;
  isUserattrLoading: boolean;
  keyPhrase: string;
  login: string;
  password: string;
  regNewUser: boolean;
  serviceName: string;
  serviceType: "CA_SERVICE";
  serviceSettings: ICAServiceSettings;
  RDNmodel: any;
}

const initialState = {
  activeSettingsTab: true,
  comment: "",
  description: "",
  email: "",
  isUserattrLoading: false,
  keyPhrase: "",
  login: "",
  password: "",
  regNewUser: true,
  serviceName: "КриптоПро УЦ 2.0",
  serviceSettings: {
    url: "https://testca2012.cryptopro.ru/ui/api/b1ca4992-d7cd-4f7e-b56e-a81e00db58ee",
  },
  serviceType: CA_SERVICE,
  RDNmodel: null,
};

interface IAddServiceProps {
  addService: (service: IService) => void;
  mapServices: Map<any, any>;
  onCancel: (service?: IService) => void;
  getRegRequest: (url: string, login: string, password: string, id: string) => void;
  postRegRequest: (url: string, comment: string, description: string, email: string, keyPhrase: string, oids: any, serviceId: string) => void;
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
                    {
                      regNewUser ?
                        <DynamicRegistrationForm
                          caURL={serviceSettings.url}
                          onCancel={this.handelCancel}
                          onRDNmodelChange={this.onRDNmodelChange}
                        />
                        : <LoginForm login={this.state.login} password={this.state.password} loginChange={this.handleLoginChange} passwordChange={this.handlePasswordChange} />
                    }
                  </div>
              }
            </div>

            <div className="row halfbottom" />

            {
              activeSettingsTab ?
                <div className="row halfbottom">
                  <div style={{ float: "left" }}>
                    <div style={{ display: "inline-block", margin: "10px" }}>
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
              comment={this.state.comment}
              commentChange={this.handleCommentChange}
              description={this.state.description}
              descriptionChange={this.handleDescriptionChange}
              email={this.state.email}
              emailChange={this.handleEmailChange}
              keyPhrase={this.state.keyPhrase}
              keyPhraseChange={this.handleKeyPhraseChange}
              nameChange={this.handleServiceNameChange}
              urlChange={this.handleCAUrlChange}
              regNewUser={regNewUser}
              service={{ settings: serviceSettings, name: serviceName }}
            />
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

  handleCommentChange = (ev: any) => {
    this.setState({ comment: ev.target.value });
  }

  handleDescriptionChange = (ev: any) => {
    this.setState({ description: ev.target.value });
  }

  handleEmailChange = (ev: any) => {
    this.setState({ email: ev.target.value });
  }

  handleKeyPhraseChange = (ev: any) => {
    this.setState({ keyPhrase: ev.target.value });
  }

  handleCAUrlChange = (ev: any) => {
    this.setState({ serviceSettings: { ...this.state.serviceSettings, url: ev.target.value } });
  }

  handleChangeServiceType = (type: "CA_SERVICE") => {
    this.setState({ serviceType: type });

    return;
  }

  handleLoginChange = (value: string) => {
    this.setState({ login: value });
  }

  handlePasswordChange = (value: any) => {
    this.setState({ password: value });
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

  onRDNmodelChange = (model: any) => {
    this.setState({ RDNmodel: { ...model } });
  }

  handleCAUserRegrequest = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { addService, getRegRequest, onCancel, postRegRequest } = this.props;
    const { comment, description, email, keyPhrase, login, password, regNewUser, serviceName,
      serviceSettings, serviceType, RDNmodel } = this.state;

    const id = uuid();
    const service: IService = {
      id,
      name: serviceName,
      settings: serviceSettings,
      type: serviceType,
    };

    if (regNewUser) {
      if (!RDNmodel) {
        this.handelCancel();
      }

      addService(service);
      postRegRequest(`${serviceSettings.url}`, comment, description, email, keyPhrase, RDNmodel, id);
      onCancel(service);
    } else {
      addService(service);
      getRegRequest(`${serviceSettings.url}`, login, password, id);
      onCancel(service);
    }
  }
}

export default connect((state) => ({
  mapServices: state.services,
}), { addService, getRegRequest, postRegRequest })(AddService);
