const React  = require('react');
const Home   = require('./home.jsx');
const About  = require('./about.jsx');

/**
 * Component: Router
 */
class Router extends React.Component {

  constructor(props) {
    super(props);
    this.state = {route: props.route};
  }

  render() {
    /* jshint ignore:start */
    return (
      <div className={this.props.className}>
      {this.state.route}
      </div>
    );
    /* jshint ignore:end */
  }
}

Root.propTypes = {
  className: React.PropTypes.string,
  navRoutes: React.PropTypes.array.isRequired
};

Root.defaultProps = {
  className: 'row',
  navRoutes: []
};

//Root.run = function (props) {
//  const routes = (
//    /* jshint ignore:start */
//    <Route name="Home" path="/" handler={Root}>
//      <Route name="About" handler={About}/>
//      <DefaultRoute handler={Home}/>
//    </Route>
//    /* jshint ignore:end */
//  );
//
//  Router.run(routes, Handler => {
//    /* jshint ignore:start */
//    React.render(<Handler {...props}/>, document.getElementById('main'));
//    /* jshint ignore:end */
//  });
//};

module.exports = Root;
