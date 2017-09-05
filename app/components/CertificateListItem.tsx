import * as React from "react";
import { connect } from "react-redux";
import { verifyCertificate } from "../AC";

//declare const $: any;

interface ICertificateListItemProps {
  chooseCert: () => void;
  selectedCert: (event: any) => void;
  operation: string;
  isOpen: boolean;
  toggleOpen: () => void;
  cert: any;
}

class CertificateListItem extends React.Component<ICertificateListItemProps, ICertificateListItemProps> {
  static contextTypes = {
    locale: React.PropTypes.string,
    localize: React.PropTypes.func,
  };

  constructor(props: ICertificateListItemProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: ICertificateListItemProps, nextState: ICertificateListItemProps) {
    return nextProps.isOpen !== this.props.isOpen ||
           nextProps.cert.verified !== this.props.cert.verified;
  }

  stopEvent = (event: any) => {
    event.stopPropagation();
  }

  addCertKey = () => {
    const CLICK_EVENT = document.createEvent("MouseEvents");

    CLICK_EVENT.initEvent("click", true, true);
    document.querySelector("#cert-key-import").dispatchEvent(CLICK_EVENT);
  }

  componentDidMount() {
    $(".cert-setting-item").dropdown();
    this.checkAndVerify(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkAndVerify(nextProps);
  }

  checkAndVerify({ cert, verifyCertificate }) {
    if (!cert.verified) {
      verifyCertificate(cert.id);
    }
  }

  handleClick = () => {
    const { chooseCert, toggleOpen} = this.props;

    chooseCert();
    toggleOpen();
  }

  render() {
    const { cert, chooseCert, operation, selectedCert, toggleOpen, isOpen } = this.props;
    const { localize, locale } = this.context;

    const trueCertStatus = {
      border: "2px solid #4caf50",
      color: "#4caf50",
    };

    const falseCertStatus = {
      border: "2px solid red",
      color: "red",
    };

    let certKeyMenu: any = null;
    let active = "";
    let doubleClick: (event: any) => void;
    let curStyle;

    const status = cert.status;
    let statusIcon = "";

    if (status) {
      statusIcon = "status_cert_ok_icon";
      curStyle = trueCertStatus;
    } else {
      statusIcon = "status_cert_fail_icon";
      curStyle = falseCertStatus;
    }

    if (isOpen) {
      active = "active";
    }
    if (operation === "certificate" && cert.key.length === 0 && cert.provider === "SYSTEM") {
      certKeyMenu = <div key={"i" + "_" + cert.key.toString()}>
        <i className="cert-setting-item waves-effect material-icons secondary-content"
          data-activates={"cert-key-set-file-" + cert.key} onClick={this.stopEvent}>more_vert</i>
        <ul id={"cert-key-set-file-" + cert.key} className="dropdown-content">
          <li><a onClick={this.addCertKey}>{localize("Certificate.import_key", locale)}</a></li>
        </ul>
      </div>;
    } else {
      certKeyMenu = "";
    }

    if (operation === "sign") {
      doubleClick = selectedCert;
    }

    return <div key={cert.id.toString()} className={"collection-item avatar certs-collection " + active}
      onClick={this.handleClick}
      onDoubleClick={doubleClick}>
      <div className="r-iconbox-link">
        <div className={"rectangle"} style={status ? {background: "#4caf50"} : {background: "red"}}></div>
        <div className="collection-title">{cert.subjectFriendlyName}</div>
        <div className="collection-info cert-info ">{cert.issuerFriendlyName}
          <div className="statusOval" style={curStyle}>{status ? localize("Certificate.cert_status_true", locale) : localize("Certificate.cert_status_false", locale)}</div>
        </div>
      </div>
      {certKeyMenu}
    </div>;
  }
}

export default connect(null, { verifyCertificate })(CertificateListItem);
