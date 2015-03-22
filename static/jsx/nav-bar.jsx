const Rx         = require('rx');
const React      = require('react');
const director   = require('director');

/**
 * Component: NavBar
 */
class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {route: this.props.routes[this.props.selected]};
  }

  componentDidMount() {
    const currentRoute = new Rx.BehaviorSubject(this.state);

    const router = new director.Router()
      //.configure({html5history: true})
      .init();

    this.props.routes.forEach(route => {
      const newState = {route: route};
      router.on(route.path, currentRoute.onNext.bind(currentRoute, newState));
    });

    currentRoute.subscribe(this.setState.bind(this));
  }

  render() {
    /* jshint ignore:start */
    return (
      <div className={this.props.className}>
        <ul className="nav nav-pills nav-stacked">
         {this.props.routes.map((route, i) => {
           return (
             <li key={i} className={this.state.route.index === i ? 'active' : ''}>
               <a href={`/#${route.path}`}>{route.name}</a>
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
  items: React.PropTypes.array.isRequired,
  selected: (props, propName, componentName) => {
    const max = props.routes.length - 1;
    const prop = props[propName];
    if (typeof prop !== 'number' ||
      prop < 0 ||
      prop > max) {
      return new Error(`Invalid prop '${propName}' of value '${prop}' ` +
      `supplied to '${componentName}', must be number between 0 and ${max}.`);
    }
  }
};

NavBar.defaultProps = {
  items   : [],
  selected: 0
};

module.exports = NavBar;
