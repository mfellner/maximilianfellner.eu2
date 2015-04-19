const router = require('koa-router')();
const React  = require('react');
const Rx     = require('Rx');
const moment = require('moment');
const uuid   = require('node-uuid');
const changeCase = require('change-case');

const config      = require('../config/config');
const contentCtrl = require('../controllers/content-controller.es6');

const NavStore     = require('../static/js/nav-store');
const ContentStore = require('../static/js/content-store');

const Body = React.createFactory(require('../static/jsx/body'));

// Set content response for all navigable route paths.
for (let route of config.navRoutes) {
  router.get(route.path, contentResponse);
}

function*contentResponse() {

  const currentRoute = Rx.Observable
    .fromArray(config.navRoutes)
    .filter(route => route.path === this.path)
    .first();

  // Request the content for the current route.
  const content = yield contentCtrl.pageContent.apply({
    method: 'GET',
    params: {
      key: yield currentRoute
        .map(route => changeCase.param(route.name))
        .toPromise()
    }
  });

  // Create the initial application state.
  const state = {
    nav      : {route  : yield currentRoute.toPromise()},
    content  : content,
    navRoutes: config.navRoutes
  };

  const props = {
    scripts        : config.allScripts(),
    styles         : config.stylesheets,
    navRoutes      : state.navRoutes,
    navStore       : new NavStore(state.nav),
    contentStore   : new ContentStore(content),
    stateCookieName: uuid.v4()
  };

  // Set a temporary cookie that contains the initial application state.
  this.cookies.set(props.stateCookieName, JSON.stringify(state), {
    httpOnly: false,
    expires : moment().add(5, 'second').toDate()
  });

  this.body = yield new Promise(resolve => resolve(React.renderToStaticMarkup(Body(props))));
}

module.exports = router.routes();
