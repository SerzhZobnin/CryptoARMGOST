import PropTypes from "prop-types";
import React from "react";
import Media from "react-media";
import { connect } from "react-redux";
import { AutoSizer, List } from "react-virtualized";
import accordion from "../../decorators/accordion";
import { mapToArr } from "../../utils";
import ServiceListItem from "./ServiceListItem";
import ServiceListItemBigWidth from "./ServiceListItemBigWidth";

const HEIGHT_MODAL = 356;
const HEIGHT_FULL = 432;
const ROW_HEIGHT = 45;

interface IServiceListProps {
  ActiveService: (service: any) => void;
}

class ServiceList extends React.Component<IServiceListProps, any> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: IServiceListProps) {
    super(props);

    this.state = ({
      activeSection: "CA_SERVICE",
      countSections: 0,
    });
  }

  componentDidMount() {

    $(".collapsible").collapsible();
  }

  render() {
    const { localize, locale } = this.context;
    const { services } = this.props;

    const ca: object[] = [];

    services.forEach((service: any) => {
      switch (service.type) {
        case "CA_SERVICE":
          return ca.push(service);
      }
    });

    let count = -1;

    if (ca.length) {
      count++;
    }

    return (
      <React.Fragment>
        <ul className="collapsible" data-collapsible="accordion">
          {this.getCollapsibleElement(localize("Services.service_ca", locale), "CA_SERVICE", ca, count, true)}
        </ul>
      </React.Fragment>
    );
  }

  getCollapsibleElement = (head: string, name: string, elements: object[], count: number, active: boolean = false) => {
    const { activeService, toggleOpenItem, isItemOpened } = this.props;

    if (!elements || elements.length === 0) {
      return null;
    }

    const activeSection = active ? "active" : "";

    return (
      <li>
        <div className={`collapsible-header color ${activeSection}`} onClick={() => this.setState({ activeSection: name })}>
          <i className={`material-icons left ${name}`}></i>
          {head}
        </div>
        <div className="collapsible-body">
          <div style={{ display: "flex" }}>
            <div style={{ flex: "1 1 auto", height: `calc(100vh - 170px - ${45 * count}px)` }}>
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    height={height}
                    overscanRowCount={1}
                    rowCount={elements.length}
                    rowHeight={ROW_HEIGHT}
                    rowRenderer={({ index, key, style }) => {
                      if (!elements.length || this.state.activeSection !== name) {
                        return null;
                      }

                      const service = elements[index];

                      return (
                        <ul key={key} style={style}>
                          <Media query="(max-width: 1020px)">
                            {(matches) =>
                              matches ? (
                                <ServiceListItem
                                  key={service.id}
                                  chooseCert={() => activeService(service)}
                                  isOpen={isItemOpened(service.id.toString())}
                                  toggleOpen={toggleOpenItem(service.id.toString())}
                                  service={service} />
                              ) : <ServiceListItemBigWidth
                                  key={service.id}
                                  chooseCert={() => activeService(service)}
                                  isOpen={isItemOpened(service.id.toString())}
                                  toggleOpen={toggleOpenItem(service.id.toString())}
                                  service={service} />
                            }
                          </Media>
                        </ul>
                      );
                    }}
                    width={width}
                  />
                )}
              </AutoSizer>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default connect((state) => {
  return {
    services: mapToArr(state.services.entities),
  };
})(accordion(ServiceList));