const React = require('react');

/**
 * Component: Content
 */
class Content extends React.Component {

  render() {
    return (
      /* jshint ignore:start */
      <div className={this.props.className}
           dangerouslySetInnerHTML={{__html: this.props.content}}
        />
      /* jshint ignore:end */
    );
  }
}

Content.propTypes = {
  className: React.PropTypes.string.isRequired,
  content  : React.PropTypes.string.isRequired
};

module.exports = Content;
