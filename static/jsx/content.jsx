const React = require('react');

/**
 * Component: Content
 */
class Content extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.props.contentStore.get();
  }

  componentWillMount() {
    this.props.contentStore.subscribe(this.setState.bind(this));
  }

  createMarkup() {
    return {__html: this.state.content};
  }

  render() {
    return (
      /* jshint ignore:start */
      <div className={this.props.className}
           dangerouslySetInnerHTML={this.createMarkup()}
        />
      /* jshint ignore:end */
    );
  }
}

Content.propTypes = {
  className   : React.PropTypes.string,
  contentStore: React.PropTypes.object.isRequired
};

module.exports = Content;
