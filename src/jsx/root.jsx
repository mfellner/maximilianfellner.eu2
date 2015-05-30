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
      this.setState({index: model.index});
    });
  }

  render() {
    return (
      /* jshint ignore:start */
      <div className="container">
        <div className="row">
          <div className="col-md-2">
            <object width="100px" data={require('../../static/img/logo.svg')} type="image/svg+xml"/>
            <NavBar className={null}
                    routes={this.props.navRoutes}
                    index={this.state.index}/>
          </div>
          <Content className="col-md-10"
                   content={this.state.content}/>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
}

Root.propTypes = {
  navRoutes     : React.PropTypes.array.isRequired,
  routeStore    : React.PropTypes.object.isRequired,
  contentStore  : React.PropTypes.object.isRequired,
  initialIndex  : React.PropTypes.number.isRequired,
  initialContent: React.PropTypes.string.isRequired
};

module.exports = Root;
