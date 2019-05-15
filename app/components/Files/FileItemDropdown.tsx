import PropTypes from "prop-types";
import React from "react";

class FileItemDropdown extends React.Component<any, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  componentDidMount() {
    $(".file-setting-item").dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false,
      gutter: 0,
      belowOrigin: false,
      alignment: "left",
    });
  }

  render() {
    const { localize, locale } = this.context;

    return (
      <React.Fragment>
        <i className="file-setting-item waves-effect material-icons secondary-content"
          data-activates={"row-dropdown-btn-set-add-files"}>more_vert</i>
        <ul id="row-dropdown-btn-set-add-files" className="dropdown-content">
          <li><a >{localize("Settings.selected_all", locale)}</a></li>
          <li><a >{localize("Settings.remove_selected", locale)}</a></li>
          <li><a >{localize("Settings.remove_all_files", locale)}</a></li>
        </ul>
      </React.Fragment>
    );
  }
}

export default FileItemDropdown;
