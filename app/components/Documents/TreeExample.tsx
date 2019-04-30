
import React from "react";
import ReactDOM from "react-dom";
import { decorators, Treebeard } from "react-treebeard";

// tslint:disable:object-literal-sort-keys

const data = {
  name: "root",
  toggled: true,
  children: [
    {
      name: "example",
      children: [
        { name: "app.js" },
        { name: "data.js" },
        { name: "index.html" },
        { name: "styles.js" },
        { name: "webpack.config.js" },
      ],
    },
    {
      name: "node_modules",
      loading: true,
      children: [],
    },
    {
      name: "src",
      children: [
        {
          name: "components",
          children: [
            { name: "decorators.js" },
            { name: "treebeard.js" },
          ],
        },
        { name: "index.js" },
      ],
    },
    {
      name: "themes",
      children: [
        { name: "animations.js" },
        { name: "default.js" },
      ],
    },
    { name: "Gulpfile.js" },
    { name: "index.js" },
    { name: "package.json" },
  ],
};

class TreeExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cursor: "",
      prevNode: ""
    };
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(node, toggled) {
    // Store previous node & de-activate
    if (this.state.prevNode !== '') {
      let stateUpdate = Object.assign({}, this.state);
      stateUpdate.prevNode.active = false;
      this.setState(stateUpdate);
    }
    this.setState({ prevNode: node });

    // Activate new node
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState({ cursor: node });
  }

  render() {
    const mydecorator = {
      Loading: (props) => {
        return (
          <div style={props.style}>
            Загрузка...
            </div>
        );
      },
      Header: (props) => {
        const activeColor = this.state.cursor.id === props.node.id ? "#428BCA" : "#9DA5AB";
        return (
          <div style={props.style.base}>
            <div id={props.node.id} style={{ color: activeColor }}>
              {props.node.name}
            </div>
          </div>
        );
      },
      Container: (props) => {
        return (
          <div onClick={props.onClick} style={{ backgroundColor: "#9DA5AB" }}>
            // Hide Toggle When Terminal Here
            <props.decorators.Toggle />
            <props.decorators.Header />
          </div>
        );
      },
    };

    return (
      <Treebeard
        data={data}
        onToggle={this.onToggle}
        decorators={{ ...decorators, Header: mydecorator.Header, Loading: mydecorator.Loading }}
      />
    );
  }
}

export default TreeExample;
