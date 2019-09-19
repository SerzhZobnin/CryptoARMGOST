import React from "react";
import { Link } from "react-router-dom";

interface IBlockWithReferenceProps {
  name: string;
  title: string;
  icon: string;
  reference: string;
  titleRef: string;
}

class BlockWithReference extends React.Component<IBlockWithReferenceProps, {}> {
  render() {
    const { name, title, icon, reference, titleRef } = this.props;
    return (
      <div className={"cert-item " + name}>
        <i className="material-icons large fullscreen">{icon}</i>
        <div className="add-file-item-text center-align">{title}</div>
        <Link to={reference}>
          <a className="add-file-item-text btn btn-outlined waves-effect waves-light">{titleRef}</a>
        </Link>
      </div>
    );
  }
}

export default BlockWithReference;
