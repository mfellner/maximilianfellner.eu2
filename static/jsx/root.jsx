const React  = require('react');
//const Router = require('react-router/build/npm');

const NavBar = require('./nav-bar.jsx');
const Home   = require('./home.jsx');
const About  = require('./about.jsx');

//const DefaultRoute = Router.DefaultRoute;
//const Link         = Router.Link;
//const Route        = Router.Route;
//const RouteHandler = Router.RouteHandler;

/**
 * Component: Root
 */
class Root extends React.Component {
  render() {
    /* jshint ignore:start */
    return (
      <div className={this.props.className}>
        <NavBar className="col-md-2" items={this.props.navItems}/>
        <Home/>
      </div>
    );
    /* jshint ignore:end */
  }
}

//<RouteHandler/>

Root.propTypes = {
  className: React.PropTypes.string,
  navItems : React.PropTypes.array.isRequired
};

Root.defaultProps = {
  className: 'row',
  navItems : []
};

//const routes = (
//  /* jshint ignore:start */
//  <Route name="root" path="/" handler={Root}>
//    <Route name="about" handler={About}/>
//    <DefaultRoute handler={Home}/>
//  </Route>
//  /* jshint ignore:end */
//);

module.exports = Root;
