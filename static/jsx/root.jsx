const React = require('react');

const NavBar = require('./nav-bar.jsx');
const Home   = React.createFactory(require('./home.jsx'));
const About  = React.createFactory(require('./about.jsx'));

/**
 * Component: Root
 */
class Root extends React.Component {

  render() {
    return (
      /* jshint ignore:start */
      <div className={this.props.className}>
        <NavBar className="col-md-2"
                routes={this.props.navRoutes}
                navStore={this.props.navStore}/>
        {this.props.content}
      </div>
      /* jshint ignore:end */
    );
  }
}

Root.propTypes = {
  className: React.PropTypes.string,
  navRoutes: React.PropTypes.array.isRequired,
  navStore : React.PropTypes.object.isRequired
};

Root.defaultProps = {
  className: 'row',
  content  : Home()
};

module.exports = Root;
