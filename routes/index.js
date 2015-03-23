const router = require('koa-router')();
const React  = require('react');
const config = require('../config/config');

const Body = React.createFactory(require('../static/jsx/body'));

function getRouteIndex(path) {
  for (var i = 0; i < config.navRoutes.length; i += 1) {
    if (config.navRoutes[i].path === path)
      return config.navRoutes[i].index;
  }
}

router.get(/^\/[a-z]*$/i, function* (next) {
  const props = {
    routeIndex: getRouteIndex(this.path),
    navRoutes : config.navRoutes,
    scripts   : config.allScripts(),
    styles    : config.stylesheets
  };

  this.body = React.renderToStaticMarkup(Body(props));

  yield next;
});

module.exports = router.routes();
