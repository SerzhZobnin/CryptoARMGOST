import PropTypes from "prop-types";
import React from "react";

interface ISelectFolderProps {
  disabled?: boolean;
  directory: string;
  viewDirect: (event: any) => void;
  openDirect: () => void;
}

class SelectFolder extends React.Component<ISelectFolderProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  render() {
    const { localize, locale } = this.context;
    const { disabled } = this.props;

    const classDisabled = disabled ? "disabled" : "";

    return (
      <div className="row nobottom">
        <div className={"col s11 " + classDisabled}>
          <input type="file" ref={(node) => node && node.setAttribute("nwdirectory", "")} id="choose-folder" onChange={this.props.viewDirect} disabled={disabled} />
          <input id="directory" type="text" placeholder={localize("Settings.directory_file_save", locale)}
            value={this.props.directory} onChange={this.props.viewDirect.bind(this)} disabled={disabled} />
        </div>
        <div className={"col s1 " + classDisabled}>
          <a className="btn-add-folder" id="add-directory" onClick={this.props.openDirect.bind(this)}>
            <i className="material-icons choosefolder">create_new_folder</i>
          </a>
        </div>
      </div>
    );
  }
}

export default SelectFolder;
