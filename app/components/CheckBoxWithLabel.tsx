import React from "react";

interface ICheckBoxWithLabelProps {
  disabled?: boolean;
  onClickCheckBox: (event: any) => void;
  isChecked: boolean;
  elementId: string;
  title: string;
}

class CheckBoxWithLabel extends React.Component<ICheckBoxWithLabelProps, any> {
  render() {
    const { disabled, isChecked, onClickCheckBox, elementId, title } = this.props;

    const classDisabled = disabled ? "disabled" : "";

    return <div className="row settings-item" >
      <div className="col s1 settings-check">
        <input
          type="checkbox"
          id={elementId}
          className="filled-in"
          onChange={onClickCheckBox}
          disabled={disabled}
          checked={isChecked} />

        <label htmlFor={elementId}></label>
      </div>
      <div className={"col s11 primary-text " + classDisabled}>{title}</div>
    </div>;
  }
}

export default CheckBoxWithLabel;
