const React = require('react');
const NavBar = require('./nav-bar.jsx');

/**
 * Component: Body
 */
class Body extends React.Component {

  render() {
    /* jshint ignore:start */
    return (
      <html lang="en">
        <meta charSet="utf-8"/>
        <head>
        {this.props.styles.map((style, i) => {
          return (
            <link key={i} rel="stylesheet" href={style}/>
          );
        })}
        </head>
        <body className="container">
          <div className="row">
            <NavBar className="col-md-2" items={this.props.navItems}/>
            <div className="col-md-10">
              <h3>Hello, Body component</h3>
              <p>Lorem ipsum, dolor sit amet.</p>
            </div>
          </div>
          <script dangerouslySetInnerHTML={{
            __html: 'var APP_PROPS = ' + JSON.stringify(this.props) + ';'
          }}>
          </script>
        {this.props.scripts.map((script, i) => {
          return (
            <script key={i} src={script}/>
          );
        })}
        </body>
      </html>
    );
    /* jshint ignore:end */
  }
}

Body.propTypes = {
  navItems: React.PropTypes.array.isRequired,
  scripts : React.PropTypes.array,
  styles  : React.PropTypes.array
};

Body.defaultProps = {
  navItems: [],
  scripts : [],
  styles  : []
};

module.exports = Body;
