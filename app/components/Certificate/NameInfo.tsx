import PropTypes from "prop-types";
import React from "react";

interface INameInfoProps {
  name: string;
}

interface INameInfoState {
  properties: string[];
}

export default class NameInfo extends React.Component<INameInfoProps, INameInfoState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: INameInfoProps) {
    super(props);

    if (props && props.name) {
      this.state = ({
        properties: props.name.split("\r\n").reverse(),
      });
    } else {
      this.state = ({
        properties: [],
      });
    }
  }

  componentDidUpdate(prevProps: INameInfoProps) {
    if (this.props.name && this.props.name !== prevProps.name) {
      this.setState({
        properties: this.props.name.split("\r\n").reverse(),
      });
    }
  }

  render() {
    return (
      <div className="collection cert-info-list">
        {this.getElements()}
      </div>
    );
  }

  getElements = () => {
    const { localize, locale } = this.context;
    const { properties } = this.state;

    return properties.map((propertie: string) => {
      const name = propertie.substring(0, propertie.indexOf("="));
      const localizedName = localize(`NamePropertie.${name}`, locale);
      const value = propertie.substring(propertie.indexOf("=") + 1);

      return <div className="collection-title selectable-text">
        {`${localizedName ? localizedName : name} = ${value}`}
      </div>;
    });
  }
}
