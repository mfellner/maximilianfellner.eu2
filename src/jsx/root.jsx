const React = require('react');

const NavBar  = require('./nav-bar.jsx');
const Content = require('./content.jsx');

/**
 * Component: Root
 */
class Root extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      index  : this.props.initialIndex,
      content: this.props.initialContent
    };
  }

  componentDidMount() {
    this.props.contentStore.subscribe(model => {
      this.setState({content: model.content});
    });
    this.props.routeStore.subscribe(model => {
      this.setState({index: model.get('index')});
    });
  }

  render() {
    return (
      /* jshint ignore:start */
      <div className={this.props.className}>
        <NavBar className="col-md-2"
                routes={this.props.navRoutes}
                index={this.state.index}/>
        <Content className="col-md-10"
                 content={this.state.content}/>
      </div>
      /* jshint ignore:end */
    );
  }
}

Root.propTypes = {
  className     : React.PropTypes.string,
  navRoutes     : React.PropTypes.array.isRequired,
  routeStore    : React.PropTypes.object.isRequired,
  contentStore  : React.PropTypes.object.isRequired,
  initialIndex  : React.PropTypes.number.isRequired,
  initialContent: React.PropTypes.string.isRequired
};

Root.defaultProps = {
  className: 'row'
};

module.exports = Root;
