const router = require('koa-router')();
const React  = require('react');
const Rx     = require('Rx');
const moment = require('moment');
const uuid   = require('node-uuid');

const config = require('../config/config');

require('babel/register');
const NavStore     = require('../static/js/nav-store.es6');
const ContentStore = require('../static/js/content-store.es6');

const Body = React.createFactory(require('../static/jsx/body'));

function getCurrentRoute(path) {
  for (var i = 0; i < config.navRoutes.length; i += 1) {
    if (config.navRoutes[i].path === path)
      return config.navRoutes[i];
  }
}

function getCurrentContent(path) {
  return {
      '/': '<h3>Home</h3>',
      '/about': '<h3>About</h3>'
    }[path] || '<h3>Not Found</h3>';
}

router.get(/^\/[a-z]*$/i, function* (next) {

  const state = {
    nav      : {route  : getCurrentRoute(this.path)},
    content  : {content: getCurrentContent(this.path)},
    navRoutes: config.navRoutes
  };

  const props = {
    scripts        : config.allScripts(),
    styles         : config.stylesheets,
    navRoutes      : state.navRoutes,
    navStore       : new NavStore(state.nav),
    contentStore   : new ContentStore(state.content),
    stateCookieName: uuid.v4()
  };

  // Set a temporary cookie that contains the initial application state.
  this.cookies.set(props.stateCookieName, JSON.stringify(state), {
    httpOnly: false,
    expires : moment().add(5, 'second').toDate()
  });

  this.body = React.renderToStaticMarkup(Body(props));

  yield next;
});

module.exports = router.routes();
