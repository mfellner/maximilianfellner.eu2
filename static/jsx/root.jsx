const React = require('react');

const NavBar  = require('./nav-bar.jsx');
const Content = require('./content.jsx');

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
        <Content className="col-md-10"
                 contentStore={this.props.contentStore}/>
      </div>
      /* jshint ignore:end */
    );
  }
}

Root.propTypes = {
  className   : React.PropTypes.string,
  navRoutes   : React.PropTypes.array.isRequired,
  navStore    : React.PropTypes.object.isRequired,
  contentStore: React.PropTypes.object.isRequired
};

Root.defaultProps = {
  className: 'row'
};

module.exports = Root;
