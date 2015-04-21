const React = require('react');
const Root  = React.createFactory(require('./root.jsx'));

/**
 * Component: Body
 */
class Body extends React.Component {

  render() {
    const rootProps = {
      navRoutes     : this.props.navRoutes,
      initialIndex  : this.props.initialIndex,
      initialContent: this.props.initialContent
    };

    return (
      /* jshint ignore:start */
      <html lang="en">
        <meta charSet="utf-8"/>
        <head>
        {this.props.styles.map((style, i) => {
          return (
            <link key={i} rel="stylesheet" href={style}/>
          );
        })}
        </head>
        <body>
          <main id="main" className="container" dangerouslySetInnerHTML={{
            __html: React.renderToString(Root(rootProps))
          }}/>
          <script dangerouslySetInnerHTML={{
            __html: `var STATE_COOKIE_NAME = '${this.props.stateCookieName}';`
          }}/>
        {this.props.scripts.map((script, i) => {
          return (
            <script key={i} src={script} defer={true}/>
          );
        })}
        </body>
      </html>
      /* jshint ignore:end */
    );
  }
}

Body.propTypes = {
  styles    : React.PropTypes.array,
  scripts   : React.PropTypes.array,
  navRoutes : React.PropTypes.array.isRequired,
  routeStore: React.PropTypes.object.isRequired
};

Body.defaultProps = {
  styles : [],
  scripts: []
};

module.exports = Body;
