const React = require('react');
const Root  = require('./root.jsx');

/**
 * Component: Body
 */
class Body extends React.Component {

  render() {
    const rootProps = {
      navItems: this.props.navItems
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
          <main id="main" className="container">
            <Root {...rootProps}/>
          </main>
          <script dangerouslySetInnerHTML={{
            __html: 'var ROOT_PROPS = ' + JSON.stringify(rootProps) + ';'
          }}>
          </script>
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
