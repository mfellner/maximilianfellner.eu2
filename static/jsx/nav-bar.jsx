const React    = require('react');
const director = require('director');

const Observables     = require('../../util/observables.es6');
const NavActions      = require('../js/nav-actions.es6');
const ContentActions  = require('../js/content-actions.es6');

/**
 * Component: NavBar
 */
class NavBar extends React.Component {

  componentDidMount() {
    const routerOn = Observables.fromCallback(this.props.router.on, this.props.router);

    this.props.router
      .configure({
        html5history: true
      })
      .init();

    this.props.routes.forEach(route => {
      const onRoute = routerOn(route.path).map(() => route);

      onRoute.subscribe(NavActions.navigateTo);
      onRoute.subscribe(ContentActions.get);
    });
  }

  onRouteClicked(route) {
    this.props.router.setRoute(route.path);
  }

  render() {
    return (
      /* jshint ignore:start */
      <div className={this.props.className}>
        <ul className="nav nav-pills nav-stacked">
          {this.props.routes.map((route, i) => {
            const onClick = this.onRouteClicked.bind(this, route);
            return (
              <li key={i} className={this.props.index === i ? 'active' : ''}>
                <a onClick={onClick}>{route.name}</a>
              </li>
            );
          }, this)}
        </ul>
      </div>
      /* jshint ignore:end */
    );
  }
}

NavBar.propTypes = {
  className: React.PropTypes.string,
  routes   : React.PropTypes.array.isRequired,
  index    : React.PropTypes.number.isRequired
};

NavBar.defaultProps = {
  router: new director.Router()
};

module.exports = NavBar;
