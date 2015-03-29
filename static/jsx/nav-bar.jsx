const Rx         = require('rx');
const React      = require('react');
const director   = require('director');

const NavActions = require('../js/nav-actions.es6');

/**
 * Component: NavBar
 */
class NavBar extends React.Component {

  constructor(props) {
    super(props);
    //this.state = {route: this.props.routes[this.props.selected]};
    this.state = this.props.state;
  }

  componentWillMount() {
    // Router can only be initialized on the client-side.
    if (this.props.router.init) {
      const currentRoute = new Rx.BehaviorSubject(this.state);

      this.props.router
        .configure({
          html5history: true
        })
        .init();

      this.props.routes.forEach(route => {
        //const newState = {route: route};
        //this.props.router.on(route.path, currentRoute.onNext.bind(currentRoute, newState));
        this.props.router.on(route.path, currentRoute.onNext.bind(currentRoute, route));
      });

      //currentRoute.subscribe(this.setState.bind(this));

      currentRoute.subscribe(NavActions.navigateTo);
    }
  }

  onRouteClicked(route) {
    console.log('onRouteClicked', route);
    this.props.router.setRoute(route.path);
  }

  render() {
    /* jshint ignore:start */
    return (
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
    );
    /* jshint ignore:end */
  }
}

NavBar.propTypes = {
  className: React.PropTypes.string,
  items    : React.PropTypes.array.isRequired//,
  //selected: (props, propName, componentName) => {
  //  const max = props.routes.length - 1;
  //  const prop = props[propName];
  //  if (typeof prop !== 'number' ||
  //    prop < 0 ||
  //    prop > max) {
  //    return new Error(`Invalid prop '${propName}' of value '${prop}' ` +
  //    `supplied to '${componentName}', must be number between 0 and ${max}.`);
  //  }
  //}
};

NavBar.defaultProps = {
  items   : [],
  //selected: 0,
  router  : new director.Router()
};

module.exports = NavBar;
