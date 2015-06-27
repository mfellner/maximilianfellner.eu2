import React    from 'react';
import showdown from 'showdown';

/**
 * Component: Content
 */
class Content extends React.Component {

  htmlFromMarkdown(markdown) {
    return this.props.converter.makeHtml(markdown);
  }

  render() {
    return (
      /* jshint ignore:start */
      <div className={this.props.className}
           dangerouslySetInnerHTML={{__html: this.htmlFromMarkdown(this.props.content)}}
        />
      /* jshint ignore:end */
    );
  }
}

Content.propTypes = {
  className: React.PropTypes.string.isRequired,
  content  : React.PropTypes.string.isRequired
};

Content.defaultProps = {
  converter: new showdown.Converter()
};

export default Content;
