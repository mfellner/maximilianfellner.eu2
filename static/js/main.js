/* global ROOT_PROPS */

require('bootstrap/less/bootstrap.less');

require(['react'], function (React) {
  const Root = React.createFactory(require('../jsx/root.jsx'));
  React.render(Root(window.ROOT_PROPS), document.getElementById('main'));
});
