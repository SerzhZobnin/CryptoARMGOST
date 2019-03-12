import PropTypes from "prop-types";
import React from "react";
import ProgressBars from "../ProgressBars";

interface IAuthWebViewProps {
  auth: string;
  onCancel: () => void;
  onTokenGet: (token: string) => void;
}

interface IAuthWebViewState {
  isLoading: boolean;
  url: string;
}

class AuthWebView extends React.PureComponent<IAuthWebViewProps, IAuthWebViewState> {
  constructor(props: IAuthWebViewProps) {
    super(props);
    this.state = {
      isLoading: false,
      // tslint:disable-next-line:max-line-length
      url: `${this.props.auth}/authorize?client_id=cryptoarm&response_type=token&scope=dss&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob%3Aauto&resource=https%3A%2F%2Fdss.cryptopro.ru%2FSignServer%2Frest%2Fapi%2Fcertificates`,
    };
  }

  componentDidMount() {
    const webview = document.getElementById("webview");

    if (webview) {
      webview.addEventListener("did-start-loading", this.loadStart);
      webview.addEventListener("did-stop-loading", this.loadStop);
      webview.addEventListener("did-get-redirect-request", (details) => this.redirect(details));
    }
  }

  render() {
    const { isLoading } = this.state;

    return (
      <React.Fragment>
        {
          isLoading ? <ProgressBars /> : null
        }
        <webview id="webview" src={this.state.url} autosize={true} style={{ height: "400px" }}></webview>
      </React.Fragment>
    );
  }

  loadStart = () => {
    this.setState({ isLoading: true });
  }

  loadStop = () => {
    this.setState({ isLoading: false });
  }

  redirect = (details) => {
    const regex = /urn:ietf:wg:oauth:2\.0:oob:auto\?access_token=([^&]*)/;
    const mathes = regex.exec(details.newURL);
    if (mathes) {
      const token = mathes[1];

      if (token && token.length) {
        this.props.onTokenGet(token);
      }

      this.props.onCancel();
    }
  }
}

export default AuthWebView;
