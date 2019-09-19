import { Map } from "immutable";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { addService } from "../../AC/servicesActions";
import { CA_SERVICE } from "../../constants";
import { uuid } from "../../utils";
import CryptoProCASettings from "../CA/CryptoProCASettings";
import DynamicRegistrationForm from "../CA/DynamicRegistrationForm";
import { ICAServiceSettings, IService } from "./types";

interface IAddServiceState {
  activeSettingsTab: boolean;
  regNewUser: boolean;
  serviceName: string;
  serviceType: "CA_SERVICE";
  serviceSettings: ICAServiceSettings;
}

const initialState = {
  activeSettingsTab: true,
  regNewUser: true,
  serviceName: "КриптоПро УЦ 2.0",
  serviceSettings: {
    url: "https://testca2012.cryptopro.ru/ui/api/b1ca4992-d7cd-4f7e-b56e-a81e00db58ee",
  },
  serviceType: CA_SERVICE,
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
                        // tslint:disable-next-line:max-line-length
                        <DynamicRegistrationForm RDN={[{ "Oid": "2.5.4.3", "Name": "CN", "LocalizedName": "Общее имя", "SettingsValues": [], "DefaultValue": "", "ProhibitAnyValue": false, "ProhibitChange": false, "ProhibitEmpty": true }, { "Oid": "2.5.4.6", "Name": "C", "LocalizedName": "Страна/регион", "SettingsValues": ["RU"], "DefaultValue": "RU", "ProhibitAnyValue": false, "ProhibitChange": true, "ProhibitEmpty": true }, { "Oid": "2.5.4.8", "Name": "S", "LocalizedName": "Область", "SettingsValues": [], "DefaultValue": null, "ProhibitAnyValue": false, "ProhibitChange": false, "ProhibitEmpty": true }, { "Oid": "2.5.4.7", "Name": "L", "LocalizedName": "Город", "SettingsValues": [], "DefaultValue": null, "ProhibitAnyValue": false, "ProhibitChange": false, "ProhibitEmpty": true }, { "Oid": "2.5.4.10", "Name": "O", "LocalizedName": "Организация", "SettingsValues": [], "DefaultValue": null, "ProhibitAnyValue": false, "ProhibitChange": false, "ProhibitEmpty": true }, { "Oid": "2.5.4.11", "Name": "OU", "LocalizedName": "Подразделение", "SettingsValues": [], "DefaultValue": null, "ProhibitAnyValue": false, "ProhibitChange": false, "ProhibitEmpty": true }, { "Oid": "1.2.840.113549.1.9.1", "Name": "E", "LocalizedName": "Адрес E-Mail", "SettingsValues": [], "DefaultValue": null, "ProhibitAnyValue": false, "ProhibitChange": false, "ProhibitEmpty": true }, { "Oid": "2.5.4.4", "Name": "SN", "LocalizedName": "Фамилия", "SettingsValues": [], "DefaultValue": null, "ProhibitAnyValue": false, "ProhibitChange": false, "ProhibitEmpty": true }, { "Oid": "2.5.4.42", "Name": "G", "LocalizedName": "Имя и отчество", "SettingsValues": [], "DefaultValue": null, "ProhibitAnyValue": false, "ProhibitChange": false, "ProhibitEmpty": true }, { "Oid": "2.5.4.9", "Name": "STREET", "LocalizedName": "Адрес", "SettingsValues": [], "DefaultValue": null, "ProhibitAnyValue": false, "ProhibitChange": false, "ProhibitEmpty": true }, { "Oid": "1.2.643.100.1", "Name": "OGRN", "LocalizedName": "ОГРН", "SettingsValues": [], "DefaultValue": null, "ProhibitAnyValue": false, "ProhibitChange": false, "ProhibitEmpty": true }, { "Oid": "1.2.643.100.3", "Name": "SNILS", "LocalizedName": "СНИЛС", "SettingsValues": [], "DefaultValue": null, "ProhibitAnyValue": false, "ProhibitChange": false, "ProhibitEmpty": true }, { "Oid": "1.2.643.3.131.1.1", "Name": "INN", "LocalizedName": "ИНН", "SettingsValues": [], "DefaultValue": null, "ProhibitAnyValue": false, "ProhibitChange": false, "ProhibitEmpty": true }, { "Oid": "2.5.4.12", "Name": "T", "LocalizedName": "Должность или звание", "SettingsValues": [], "DefaultValue": null, "ProhibitAnyValue": false, "ProhibitChange": false, "ProhibitEmpty": true }]} />
                        : null
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
                      <a className={"btn btn-outlined waves-effect waves-light modal-close "} onClick={this.handleAdd}>{localize("Services.connect", locale)}</a>
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
    // tslint:disable-next-line:no-shadowed-variable
    const { addService, onCancel } = this.props;
    const { serviceName, serviceSettings, serviceType } = this.state;
    const { localize, locale } = this.context;

    const id = uuid();
    const service: IService = {
      id,
      name: serviceName,
      settings: serviceSettings,
      type: serviceType,
    };

    if (service.type === CA_SERVICE) {
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
}

export default connect((state) => ({
  mapServices: state.services,
}), { addService })(AddService);
