import React    from 'react';
import director from 'director';

import Observables    from '../util/observables.es6';
import NavActions     from '../actions/nav-actions.es6';
import ContentActions from '../actions/content-actions.es6';

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

  onRouteClicked(route, event) {
    this.props.router.setRoute(route.path);
    event.preventDefault(); // don't follow href
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
                <a onClick={onClick} href={route.path}>{route.name}</a>
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

export default NavBar;
