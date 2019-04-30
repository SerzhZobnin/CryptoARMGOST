export class Treebeard {
  static defaultProps: {
    animations: {
      drawer: Function;
      toggle: Function;
    };
    decorators: {
      Container: Function;
      Header: Function;
      Loading: {
        $$typeof: any;
        propTypes: any;
        render: any;
        withComponent: any;
      };
      Toggle: Function;
    };
    style: {
      tree: {
        base: any;
        node: any;
      };
    };
  };
  constructor(...args: any[]);
  forceUpdate(callback: any): void;
  render(): any;
  setState(partialState: any, callback: any): void;
}
export namespace Treebeard {
  namespace propTypes {
    function animations(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    namespace animations {
      function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    }
    function data(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    function decorators(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    namespace decorators {
      function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    }
    function onToggle(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    namespace onToggle {
      function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    }
    function style(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    namespace style {
      function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    }
  }
}
export namespace animations {
  function drawer(): any;
  function toggle(_ref: any): any;
}
export namespace decorators {
  class Container {
    constructor(...args: any[]);
    forceUpdate(callback: any): void;
    render(): any;
    renderToggle(): any;
    renderToggleDecorator(): any;
    setState(partialState: any, callback: any): void;
  }
  namespace Container {
    namespace propTypes {
      function animations(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
      function decorators(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
      function node(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
      function onClick(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
      function style(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
      function terminal(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    }
  }
  function Header(_ref6: any): any;
  namespace Header {
    namespace propTypes {
      function node(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
      function style(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
      namespace style {
        // Too-deep object hierarchy from index.decorators.Header.propTypes.style
        const isRequired: any;
      }
    }
  }
  namespace Loading {
    const $$typeof: symbol;
    namespace propTypes {
      function style(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
      namespace style {
        // Too-deep object hierarchy from index.decorators.Loading.propTypes.style
        const isRequired: any;
      }
    }
    function render(props: any, ref: any): any;
    function withComponent(nextTag: any, nextOptions: any): any;
  }
  function Toggle(_ref5: any): any;
  namespace Toggle {
    namespace propTypes {
      function style(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
      namespace style {
        // Too-deep object hierarchy from index.decorators.Toggle.propTypes.style
        const isRequired: any;
      }
    }
  }
}
export const theme: {
  tree: {
    base: {
      backgroundColor: string;
      color: string;
      fontFamily: string;
      fontSize: string;
      listStyle: string;
      margin: number;
      padding: number;
    };
    node: {
      activeLink: {
        background: any;
      };
      base: {
        position: any;
      };
      header: {
        base: any;
        connector: any;
        title: any;
      };
      link: {
        cursor: any;
        display: any;
        padding: any;
        position: any;
      };
      loading: {
        color: any;
      };
      subtree: {
        listStyle: any;
        paddingLeft: any;
      };
      toggle: {
        arrow: any;
        base: any;
        height: any;
        width: any;
        wrapper: any;
      };
    };
  };
};
