const React  = require('react');

const NavBar = require('./nav-bar.jsx');
const Home   = React.createFactory(require('./home.jsx'));
const About  = React.createFactory(require('./about.jsx'));

/**
 * Component: Root
 */
class Root extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      navState: this.props.navStore.get()
    };
  }

  componentDidMount() {
    this.props.navStore.navState.subscribe(this.setNavState.bind(this));
  }

  setNavState(navState) {
    this.setState({
      content : this.props.content,
      navState: navState
    });
  }

  render() {
    /* jshint ignore:start */
    return (
      <div className={this.props.className}>
        <NavBar className="col-md-2"
                routes={this.props.navRoutes}
                state={this.state.navState}/>
        {this.state.content}
      </div>
    );
    /* jshint ignore:end */
  }
}

Root.propTypes = {
  className: React.PropTypes.string,
  navRoutes: React.PropTypes.array.isRequired,
  navStore : React.PropTypes.object.isRequired
};

Root.defaultProps = {
  content  : Home(),
  className: 'row',
  navRoutes: []
};

module.exports = Root;
