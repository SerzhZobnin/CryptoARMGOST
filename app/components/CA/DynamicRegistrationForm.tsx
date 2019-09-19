import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";

interface IRDNObject {
  /**
   * Значение OIDэлемента учетной записи пользователя
   */
  Oid: string;
  /**
   * Наименование OIDэлемента учетной записи пользователя
   */
  Name: string;
  /**
   * Локализованное наименование OIDэлемента учетной записи пользователя
   */
  LocalizedName: string;
  /**
   * Список возможных значений элемента учетной записи пользователя
   */
  SettingsValues: string[];
  /**
   * Значение по умолчанию элемента учетной записи пользователя из списка SettingValues
   */
  DefaultValue: string;
  /**
   * Флаг указывающий, что значение элемента учетной записи входит в список значений SettingsValues
   */
  ProhibitAnyValue: boolean;
  /**
   * Флаг указывающий, что элемент учетной записи не может быть изменен
   */
  ProhibitChange: boolean;
  /**
   * Флаг указывающий, что элемент учетной записи должен быть непустым
   */
  ProhibitEmpty: boolean;
}

interface IDynamicRegistrationFormProps {
  /**
   * Значения элементов учетных записей пользователейорганизованных в папке УЦ
   *
   * @type {IRDNObject[]}
   * @memberof IDynamicRegistrationFormProps
   */
  RDN: IRDNObject[];
}

interface IDynamicRegistrationFormState {
  [key: string]: string;
}

class DynamicRegistrationForm extends React.Component<IDynamicRegistrationFormProps, IDynamicRegistrationFormState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: any) {
    super(props);

    const model: any = {};

    props.RDN.map((field: IRDNObject) => model[field.Oid] = field.DefaultValue);

    this.state = { ...model };
  }

  componentDidMount() {
    const self = this;

    $(document).ready(() => {
      $("select").material_select();

      $("select").on("change", self.handleInputChange);
    });

    Materialize.updateTextFields();
  }

  componentDidUpdate() {
    Materialize.updateTextFields();
  }

  render() {
    const { localize, locale } = this.context;
    const { RDN } = this.props;

    return (
      <div className="row">
        {
          RDN.map((field: IRDNObject) => {
            if (field.SettingsValues && field.SettingsValues.length) {
              return (
                <div className="row">
                  <div className="input-field input-field-csr col s12">
                    <select
                      disabled={field.ProhibitChange}
                      id={field.Oid}
                      className="select"
                      name={field.Oid}
                      value={field.DefaultValue}
                      onChange={this.handleInputChange}
                    >
                      {
                        field.SettingsValues.map((settingsValue) =>
                          <option value={settingsValue}>
                            {settingsValue}
                          </option>)
                      }
                    </select>

                    <label htmlFor={field.Oid}>{field.LocalizedName} {field.ProhibitEmpty ? " *" : ""}</label>
                  </div>
                </div>
              );
            } else {
              const oidValue = this.state[field.Oid];

              return (
                <div className="row">
                  <div className="input-field input-field-csr col s12">
                    <input
                      disabled={field.ProhibitChange}
                      id={field.Oid}
                      type="text"
                      className="validate"
                      name={field.Oid}
                      value={oidValue}
                      onChange={this.handleInputChange}
                      placeholder={`${field.LocalizedName} (oid: ${field.Oid})`}
                    />
                    <label htmlFor={field.Oid}>{field.LocalizedName} {field.ProhibitEmpty ? " *" : ""}</label>
                  </div>
                </div>
              );
            }
          })
        }
      </div>
    );
  }

  handleInputChange = (ev: any) => {
    const target = ev.target;
    const name = target.name;

    this.setState({
      [name]: ev.target.value,
    });
  }
}

export default DynamicRegistrationForm;
