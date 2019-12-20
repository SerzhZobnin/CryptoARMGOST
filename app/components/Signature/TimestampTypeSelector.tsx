import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";

interface ITimestampTypeSelectorProps {
  timeStampTypes: string[];
  changeType: (value: string) => void;
}

const StampType = {
  stContent: "1",
  stSignature: "2",
  // tslint:disable-next-line: object-literal-sort-keys
  stEscStamp: "4",
};

class TimestampTypeSelector extends React.Component<ITimestampTypeSelectorProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  /**
   * https://github.com/facebook/react/issues/3667
   */
  componentDidMount() {
    const { changeType, timeStampTypes } = this.props;
    $(document).ready(() => {
      $("select").material_select();
    });
    $(ReactDOM.findDOMNode(this.refs.type_of_signature)).on("change", this.changeStampType);

    changeType(timeStampTypes[0]);
  }

  render() {
    const { localize, locale } = this.context;
    const { timeStampTypes } = this.props;

    if (!timeStampTypes || !timeStampTypes.length) {
      return null;
    }

    return (
      <div className="row nobottom col s12">
        <div className="input-field">
          <select
            className="select"
            id="type_of_signature"
            ref="type_of_signature"
            defaultValue={StampType.stContent.toString()}>
            {
              timeStampTypes.map((type) =>
                <option value={type}>
                  {this.localizeTimeStamp(type)}
                </option>,
              )
            }
          </select>
          <label>
            {localize("Cades.timestamp_type", locale)}
          </label>
        </div>
      </div>
    );
  }

  localizeTimeStamp = (type: string) => {
    const { localize, locale } = this.context;

    switch (type) {
      case StampType.stContent:
        return localize("Cades.timestamp_on_data", locale);

      case StampType.stSignature:
        return localize("Cades.timestamp_on_sign", locale);

      case StampType.stEscStamp:
        return localize("Cades.timestamp_on_cades", locale);
    }
  }

  changeStampType = (ev: any) => {
    this.props.changeType(ev.target.value);
  }
}

export default TimestampTypeSelector;
