import React from "react";
import { CRYPTOPRO_DSS } from "../constants";
import { MEGAFON } from "../service/megafon/constants";

const rectangleValidStyle = {
  background: "#4caf50",
};

const rectangleUnvalidStyle = {
  background: "#bf3817",
};

class RecipientsList extends React.Component<any, any> {
  timer: number | NodeJS.Timer = 0;
  delay = 200;
  prevent: boolean = false;

  handleClick = (element) => {
    const { onActive } = this.props;

    this.timer = setTimeout(() => {
      if (!this.prevent) {
        onActive(element);
      }
      this.prevent = false;
    }, this.delay);
  }

  handleDoubleClick = (element) => {
    const { handleRemoveRecipient } = this.props;

    clearTimeout(this.timer);
    this.prevent = true;
    handleRemoveRecipient(element);
  }

  render() {
    const { recipients, dialogType } = this.props;

    if (!recipients || !recipients.length) {
      return null;
    }

    return (
      <div className="choose-certs-view">
        <div className={"add-cert-collection collection "}>
          {recipients.map((element) => {
            let curStatusStyle;
            let curKeyStyle;
            let rectangleStyle;
            if (element.status) {
              curStatusStyle = "cert_status_ok";
              rectangleStyle = rectangleValidStyle;
            } else {
              curStatusStyle = "cert_status_error";
              rectangleStyle = rectangleUnvalidStyle;
            }

            if (element.key.length > 0) {
              curKeyStyle = "key ";
              if (curKeyStyle) {
                if (element.service) {
                  if (element.service === MEGAFON) {
                    curKeyStyle += "megafonkey";
                  } else if (element.service === CRYPTOPRO_DSS) {
                    curKeyStyle += "dsskey";
                  }
                } else {
                  curKeyStyle += "localkey";
                }
              }
            } else {
              curKeyStyle = "";
            }

            return <div className="collection-item avatar certs-collection" key={element.id + 1}
              onClick={() => this.handleClick(element)}
              onDoubleClick={() => this.handleDoubleClick(element)}>
              <div className="row nobottom">
                <div className="col s1" style={{ padding: 0, width: "0%" }}>
                  <div className="rectangle" style={rectangleStyle} />
                </div>
                <div className="col s11">
                  <div className="collection-title">{element.subjectFriendlyName}</div>
                  <div className="collection-info cert-info ">{element.issuerFriendlyName}</div>
                </div>
                <div className="col s1">
                  <div className="row nobottom">
                    <div className={curStatusStyle} />
                  </div>
                  <div className="row nobottom">
                    <div className={curKeyStyle} />
                  </div>
                </div>
              </div>
            </div>;
          })}
        </div>
      </div>
    );
  }
}

export default RecipientsList;
