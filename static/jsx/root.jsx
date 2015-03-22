const React  = require('react');
//const Router = require('react-router/build/npm');

const NavBar = require('./nav-bar.jsx');
const Home   = require('./home.jsx');
const About  = require('./about.jsx');

/**
 * Component: Root
 */
class Root extends React.Component {
  render() {
    /* jshint ignore:start */
    return (
      <div className={this.props.className}>
        <NavBar className="col-md-2" routes={this.props.navRoutes}/>
        <Home/>
      </div>
    );
    /* jshint ignore:end */
  }
}

//<RouteHandler/>

Root.propTypes = {
  className: React.PropTypes.string,
  navRoutes: React.PropTypes.array.isRequired
};

Root.defaultProps = {
  className: 'row',
  navRoutes: []
};

module.exports = Root;
