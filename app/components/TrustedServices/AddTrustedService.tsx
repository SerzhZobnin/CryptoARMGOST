import PropTypes from "prop-types";
import React from "react";

interface IAddTrustedServiceProps {
  onCancel?: () => void;
}

interface IAddTrustedServiceState {
  saveService: boolean;
}

class AddTrustedService extends React.Component<
  IAddTrustedServiceProps,
  IAddTrustedServiceState
> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: IAddTrustedServiceProps) {
    super(props);

    this.state = {
      saveService: false,
    };
  }

  componentWillUnmount() {
    this.handelCancel();
  }

  render() {
    const { saveService } = this.state;
    const { localize, locale } = this.context;

    return (
      <React.Fragment>
        <div className="row halftop">
          <div className="col s12">
            <div className="content-wrapper tbody border_group">
              <div className="row">
                <div className="input-field col s12">
                  <input
                    name="groupDelCont"
                    type="checkbox"
                    id="delCont"
                    className="checkbox-red"
                    checked={saveService}
                    onClick={this.toggleSaveService}
                  />
                  <label htmlFor="delCont">Сохранить сервис</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row halfbottom" />

        <div className="row halfbottom">
          <div style={{ float: "right" }}>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a
                className="btn btn-text waves-effect waves-light modal-close"
                onClick={this.handelCancel}
              >
                {localize("Common.cancel", locale)}
              </a>
            </div>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a
                className="btn btn-outlined waves-effect waves-light modal-close"
                onClick={() => console.log("service")}
              >
                {localize("Common.delete", locale)}
              </a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  handelCancel = () => {
    const { onCancel } = this.props;

    if (onCancel) {
      onCancel();
    }
  };

  toggleSaveService = () => {
    this.setState({ saveService: !this.state.saveService });
  };
}

export default AddTrustedService;
