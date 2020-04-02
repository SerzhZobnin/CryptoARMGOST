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

const HOST = "https://localhost:3000";
const CLIENT_ID = "135e81999d5dde2a7d88acd01977ddba";
export const SERVICE_URL = "https://id.trusted.plus";

class AuthWebView extends React.PureComponent<IAuthWebViewProps, IAuthWebViewState> {
  constructor(props: IAuthWebViewProps) {
    super(props);
    this.state = {
      isLoading: false,
      // tslint:disable-next-line:max-line-length
      url:
      SERVICE_URL +
      "/idp/sso/oauth" +
      "?client_id=" +
      CLIENT_ID +
      "&redirect_uri=" +
      encodeURIComponent(HOST + "/code") +
      "&scope=" +
      "userprofile" +
      "&code_challenge_method=" +
      "S256",
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
        <webview id="webview" src={this.state.url} autosize="true" style={{ height: "400px" }}></webview>
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
