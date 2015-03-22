const React = require('react');
const Root  = React.createFactory(require('./root.jsx'));

/**
 * Component: Body
 */
class Body extends React.Component {

  render() {
    const rootProps = {
      navRoutes: this.props.navRoutes
    };
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
        <body>
          <main id="main" className="container" dangerouslySetInnerHTML={{
            __html: React.renderToString(Root(rootProps))
          }}/>
          <script dangerouslySetInnerHTML={{
            __html: `var ROOT_PROPS = ${JSON.stringify(rootProps)};`
          }}/>
        {this.props.scripts.map((script, i) => {
          return (
            <script key={i} src={script} defer={true}/>
          );
        })}
        </body>
      </html>
    );
    /* jshint ignore:end */
  }
}

Body.propTypes = {
  scripts: React.PropTypes.array,
  styles : React.PropTypes.array
};

Body.defaultProps = {
  scripts: [],
  styles : []
};

module.exports = Body;
