const router = require('koa-router')();
const React  = require('react');
const config = require('../config/config');

require('babel/register');
const NavStore   = require('../static/js/nav-store.es6');
const NavActions = require('../static/js/nav-actions.es6');

const Body = React.createFactory(require('../static/jsx/body'));

function getRouteIndex(path) {
  for (var i = 0; i < config.navRoutes.length; i += 1) {
    if (config.navRoutes[i].path === path)
      return config.navRoutes[i].index;
  }
}

router.get(/^\/[a-z]*$/i, function* (next) {

  const navStore = new NavStore({
    route: config.navRoutes[getRouteIndex(this.path)]
  });

  const props = {
    routeIndex: getRouteIndex(this.path),
    navRoutes : config.navRoutes,
    scripts   : config.allScripts(),
    styles    : config.stylesheets,
    navStore  : navStore
  };

  // Wire up the store with the actions.
  new NavActions().register(props.navStore.updates);

  this.body = React.renderToStaticMarkup(Body(props));

  yield next;
});

module.exports = router.routes();
