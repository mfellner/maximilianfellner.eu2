const router = require('koa-router')();
const React  = require('react');
const Rx     = require('Rx');
const moment = require('moment');
const uuid   = require('node-uuid');
const changeCase = require('change-case');

const config      = require('../config/config');
const contentCtrl = require('../controllers/content-controller.es6');

const Body = React.createFactory(require('../static/jsx/body'));

// Set content response for all navigable route paths.
for (let route of config.navRoutes) {
  router.get(route.path, contentResponse);
}

function*contentResponse() {

  const currentRoute = yield Rx.Observable
    .fromArray(config.navRoutes)
    .filter(route => route.path === this.path)
    .first()
    .toPromise();

  // Request the content for the current route.
  const contentModel = yield contentCtrl.pageContent.apply({
    method: 'GET',
    params: {
      key: changeCase.param(currentRoute.name)
    }
  });

  // Create the initial application state.
  const state = {
    route    : currentRoute,
    content  : contentModel,
    navRoutes: config.navRoutes
  };

  const props = {
    scripts        : config.allScripts(),
    styles         : config.stylesheets,
    navRoutes      : config.navRoutes,
    initialIndex   : currentRoute.index,
    initialContent : contentModel.content,
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
