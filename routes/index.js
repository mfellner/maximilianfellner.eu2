const router = require('koa-router')();
const React = require('react');
const config = require('../config/config');

const Body = React.createFactory(require('../static/jsx/body'));

router.get('/', function* (next) {
  const props = {
    navItems: ['Home', 'About', 'Contact'],
    scripts: config.allScripts(),
    styles: config.stylesheets
  };

  this.body = React.renderToString(Body(props));

  yield next;
});

module.exports = router.routes();
