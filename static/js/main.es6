/* global STATE_COOKIE_NAME: false */

require('bootstrap/less/bootstrap.less');
require('babel/polyfill');

const React   = require('react');
const Cookies = require('cookies-js');
const co      = require('co');

const NavActions     = require('./actions/nav-actions.es6');
const ContentActions = require('./actions/content-actions.es6');
const RouteStore     = require('./stores/route-store.es6');
const ContentStore   = require('./stores/content-store.es6');

const Root = React.createFactory(require('../jsx/root.jsx'));

// Read and expire the temporary cookie with the initial application state.
const state = JSON.parse(Cookies.get(STATE_COOKIE_NAME));
Cookies.expire(STATE_COOKIE_NAME);

const routeStore     = new RouteStore(state.route);
const contentStore = new ContentStore(state.content);

// Wire up the stores with the actions.
routeStore.registerActions(NavActions);
contentStore.registerActions(ContentActions);

co(function*() {
  const routeModel   = yield routeStore.getModel();
  const initialIndex = routeModel.get('index');

  const contentModel   = yield contentStore.getModel();
  const initialContent = contentModel.get('content');

  return {
    navRoutes     : state.navRoutes,
    routeStore    : routeStore,
    contentStore  : contentStore,
    initialIndex  : initialIndex,
    initialContent: initialContent
  };
}).then(props => React.render(Root(props), document.getElementById('main')));
