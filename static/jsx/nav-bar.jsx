const React = require('react');

/**
 * Component: NavBar
 */
const NavBar = React.createClass({

  propTypes: {
    className: React.PropTypes.string,
    items: React.PropTypes.array.isRequired,
    selected: function (props, propName, componentName) {
      const max = props.items.length - 1;
      const prop = props[propName];
      if (typeof prop !== 'number' ||
        prop < 0 ||
        prop > max) {
        return new Error(`Invalid prop '${propName}' of value '${prop}' ` +
        `supplied to '${componentName}', must be number between 0 and ${max}.`);
      }
    }
  },

  getDefaultProps: function () {
    return {
      items: [],
      selected: 0
    };
  },

  getInitialState: function () {
    return {selected: this.props.selected};
  },

  handleClick: function (index) {
    this.setState({selected: index});
  },

  render: function () {
    /* jshint ignore:start */
    return (
      <div className={this.props.className}>
        <ul className="nav nav-pills nav-stacked">
         {this.props.items.map(function (item, i) {
           const boundClick = this.handleClick.bind(this, i);
           return (
             <li key={i} className={this.state.selected === i ? 'active' : ''}>
               <a onClick={boundClick} href="#">{item}</a>
             </li>
           );
         }, this)}
        </ul>
      </div>
    );
    /* jshint ignore:end */
  }
});

module.exports = NavBar;
