const React = require('react');

/**
 * Component: About
 */
class About extends React.Component {
  render() {
    /* jshint ignore:start */
    return (
      <div className="col-md-10">
        <h3>Hello, About component</h3>
        <p>
          Ut wisi enim ad minim veniam, quis nostrud exerci tation
          ullamcorper suscipit lobortis nisl ut aliquip ex ea
          commodo consequat. Duis autem vel eum iriure dolor in
          hendrerit in vulputate velit esse molestie consequat,
          vel illum dolore eu feugiat nulla facilisis at vero eros
          et accumsan et iusto odio dignissim qui blandit praesent
          luptatum zzril delenit augue duis dolore te feugait
          nulla facilisi.
        </p>
      </div>
    );
    /* jshint ignore:end */
  }
}

module.exports = About;
