import PropTypes from "prop-types";
import React from "react";

interface IDynamicRegistrationFormProps {
  model: any;
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

    this.state = {};
  }

  componentDidMount() {
    Materialize.updateTextFields();
  }

  componentDidUpdate() {
    Materialize.updateTextFields();
  }

  render() {
    const { localize, locale } = this.context;
    const { model } = this.props;

    return (
      <div className="row">
        {
          model.map((field: any) => {
            return (
              <div className="row">
                <div className="input-field input-field-csr col s12">
                  <input
                    id={field.Oid}
                    type="text"
                    className="validate"
                    name={field.Oid}
                    value={field.DefaultValue}
                    onChange={this.handleInputChange}
                    placeholder={`${field.LocalizedName} (oid: ${field.Oid})`}
                  />
                  <label htmlFor={field.Oid}>{field.LocalizedName}</label>
                </div>
              </div>
            );
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
