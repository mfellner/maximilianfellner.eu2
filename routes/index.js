const router = require('koa-router')();
const React  = require('react');
const config = require('../config/config');

const Body = React.createFactory(require('../static/jsx/body'));

router.get('/', function* (next) {
  const props = {
    navRoutes: config.navRoutes,
    scripts  : config.allScripts(),
    styles   : config.stylesheets
  };

  console.log('this.url', this.url);
  console.log('this.request.url', this.request.url);

  this.body = React.renderToStaticMarkup(Body(props));

  yield next;
});

module.exports = router.routes();
