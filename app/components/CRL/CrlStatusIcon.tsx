import React from "react";
import { connect } from "react-redux";
import { verifyCRL } from "../../AC";

interface ICrlStatusIconProps {
  crl: any;
  verifyCRL: (id: string) => void;
}

class CrlStatusIcon extends React.Component<ICrlStatusIconProps, {}> {
  timerHandle: NodeJS.Timer | null;

  componentDidMount() {
    // tslint:disable-next-line: no-shadowed-variable
    const { crl, verifyCRL } = this.props;

    this.timerHandle = setTimeout(() => {
      if (!crl.verified) {
        verifyCRL(crl.id);
      }

      this.timerHandle = null;
    }, 2000);
  }

  componentWillUnmount() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = null;
    }
  }

  render() {
    const { crl } = this.props;

    if (!crl) {
      return null;
    }

    let curStatusStyle;

    if (crl && crl.status) {
      curStatusStyle = "cert_status_ok";
    } else {
      curStatusStyle = "cert_status_error";
    }

    return (
      <div className={curStatusStyle} />
    );
  }
}

export default connect((state, ownProps: any) => {
  return {
    crl: ownProps.crl ? state.crls.getIn(["entities", ownProps.crl.id]) : undefined,
  };
}, { verifyCRL })(CrlStatusIcon);
