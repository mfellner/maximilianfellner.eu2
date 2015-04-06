const Rx       = require('rx');
const React    = require('react');
const director = require('director');

const Observables = require('../../util/observables.es6');
const NavActions  = require('../js/nav-actions.es6');

/**
 * Component: NavBar
 */
class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.props.navStore.get();
  }

  componentDidMount() {
    const routerOn = Observables.fromCallback(this.props.router.on, this.props.router);

    this.props.router
      .configure({
        html5history: true
      })
      .init();

    this.props.routes.forEach(route => {
      routerOn(route.path)
        .map(() => {
          return route;
        })
        .subscribe(NavActions.navigateTo);
    });

    this.props.navStore.navState.subscribe(this.setState.bind(this));
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
              <li key={i} className={this.state.route.index === i ? 'active' : ''}>
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
  navStore : React.PropTypes.object.isRequired
};

NavBar.defaultProps = {
  router: new director.Router()
};

module.exports = NavBar;
