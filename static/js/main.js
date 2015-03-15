require('bootstrap/less/bootstrap.less');

require(['react'], function (React) {
  const Body = React.createFactory(require('../jsx/body.jsx'));
  React.render(Body(window.APP_PROPS), document);
});
