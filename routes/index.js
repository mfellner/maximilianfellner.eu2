const router = require('koa-router')();
const React  = require('react');
const config = require('../config/config');

require('babel/register');
const NavStore   = require('../static/js/nav-store.es6');
const NavActions = require('../static/js/nav-actions.es6');

const Body = React.createFactory(require('../static/jsx/body'));

function getCurrentRoute(path) {
  for (var i = 0; i < config.navRoutes.length; i += 1) {
    if (config.navRoutes[i].path === path)
      return config.navRoutes[i];
  }
}

router.get(/^\/[a-z]*$/i, function* (next) {

  const props = {
    navStore  : new NavStore(),
    navRoutes : config.navRoutes,
    scripts   : config.allScripts(),
    styles    : config.stylesheets
  };

  // Wire up the store with the actions.
  NavActions.register(props.navStore.updates);

  const promise = new Promise(function (resolve) {
    props.navStore.navState.first().subscribe(function () {
      resolve(React.renderToStaticMarkup(Body(props)));
    });
  });

  // Send current route to store.
  NavActions.navigateTo.onNext(getCurrentRoute(this.path));

  this.body = yield promise;

  yield next;
});

module.exports = router.routes();
