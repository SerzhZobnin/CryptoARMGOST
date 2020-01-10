import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { bytesToSize } from "../../utils";
import FileIcon from "../Files/FileIcon";
import SignerCertificateInfo from "../SignerCertificateInfo";
import SignatureStatus from "./SignatureStatus";

interface ISignatureInfoBlockState {
  signerIndex: number;
}

class SignatureInfoBlock extends React.Component<any, ISignatureInfoBlockState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: any) {
    super(props);

    this.state = {
      signerIndex: 0,
    };
  }

  componentDidMount() {
    Materialize.updateTextFields();
  }

  render() {
    const { signerCertificate, file, signatures, handleActiveCert, handleNoShowSignatureInfo, handleNoShowSignerCertificateInfo } = this.props;
    const { localize, locale } = this.context;
    const { signerIndex } = this.state;

    if (!signatures) {
      return null;
    }

    if (signerCertificate) {
      return <SignerCertificateInfo handleBackView={handleNoShowSignerCertificateInfo} certificate={signerCertificate} />;
    }

    const elements = signatures.map((signature: any) => {
      return (
        <SignatureStatus key={signature.id} signature={signature} handleActiveCert={handleActiveCert} />
      );
    });

    const element = elements[signerIndex];

    const status = this.getSignaturesStatus(signatures);

    return (
      <React.Fragment>
        <div className="row">
          <div className="col s2" style={{ width: "11%" }}>
            <div className={status ? "status_ok_icon" : "status_error_icon"} />
          </div>
          <div className="col s10 ">
            <div className="col s12">
              <div className={status ? "valid" : "unvalid"}>{status ? localize("Sign.sign_ok", locale) : localize("Sign.sign_error", locale)}</div>
              <div className="collection-info ">{"Проверена:"} {(new Date(signatures[0].verifyingTime)).toLocaleDateString(locale, {
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                month: "numeric",
                year: "numeric",
              })}</div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s2 " style={{ width: "11%" }}>
            <FileIcon file={file} style={{ left: "0px", position: "relative" }} />
          </div>

          <div className="col s10">
            <div className="col s12">
              <div className="truncate">{file.filename}</div>
            </div>
            <div className="col s7">
              <div className="collection-info truncate">{(new Date(file.mtime)).toLocaleDateString(locale, {
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                month: "numeric",
                year: "numeric",
              })}
              </div>
            </div>
            <div className="col s4">
              <div className="collection-info truncate">{bytesToSize(file.filesize)}</div>
            </div>
          </div>
        </div>

        {signatures.length > 1 ?
          <div className="row">
            <div className="col s12 primary-text">Подписи документа:</div>
            <div className="row halfbottom" />
            <div className="add-cert-collection collection">
              {this.getSigners()}
            </div>
          </div> :
          null
        }

        <div>
          {element}
        </div>
      </React.Fragment>
    );
  }

  getSigners = () => {
    const { localize, locale } = this.context;
    const { signatures } = this.props;
    const { signerIndex } = this.state;

    return (
      signatures.map((signature: any, index: number) => {
        let status = "";
        let icon = "";
        let isValid = "";

        if (signature.status_verify === true) {
          status = localize("Sign.sign_ok", locale);
          icon = "status_ok_icon";
          isValid = "valid";
        } else {
          status = localize("Sign.sign_error", locale);
          icon = "status_error_icon";
          isValid = "unvalid";
        }

        const dateSigningTime = new Date(signature.signingTime);
        dateSigningTime.setHours(dateSigningTime.getHours());

        const active = signerIndex === index ? "active" : "";

        return (
          <div key={signature.id} className="row certificate-list-item col s12" id={signature.id}>
            <div className={`collection-item avatar certs-collection valign-wrapper ${active}`}
              onClick={() => this.handleSignerChange(index)}>
              <React.Fragment>
                <div className="col s1" style={{ width: "15%" }}>
                  <div className={icon} />
                </div>
                <div className="col s11">
                  <div className="collection-title">{signature.subject}</div>

                  <div className={isValid}>{status}</div>

                  <div className="collection-info">{localize("Sign.signingTime", locale)}: {signature.signingTime ? (new Date(dateSigningTime)).toLocaleString(locale, {
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    month: "long",
                    year: "numeric",
                  }) : "-"}
                  </div>
                </div>
              </React.Fragment>
            </div>
          </div>
        );
      })
    );
  }

  handleSignerChange = (index: any) => {
    this.setState({ signerIndex: index });
  }

  getSignaturesStatus = (signatures) => {
    let res = true;

    if (signatures) {
      for (const element of signatures) {
        if (!element.status_verify) {
          res = false;
          break;
        }
      }

      return res;
    } else {
      return false;
    }
  }
}

export default SignatureInfoBlock;
