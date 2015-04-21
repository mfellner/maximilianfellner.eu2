/* global STATE_COOKIE_NAME: false */

require('bootstrap/less/bootstrap.less');
require('babel/polyfill');

const React   = require('react');
const Cookies = require('cookies-js');
const co      = require('co');

const NavActions     = require('./actions/nav-actions.es6');
const ContentActions = require('./actions/content-actions.es6');
const NavStore       = require('./stores/nav-store.es6');
const ContentStore   = require('./stores/content-store.es6');

const Root = React.createFactory(require('../jsx/root.jsx'));

// Read and expire the temporary cookie with the initial application state.
const state = JSON.parse(Cookies.get(STATE_COOKIE_NAME));
Cookies.expire(STATE_COOKIE_NAME);

const navStore     = new NavStore(state.route);
const contentStore = new ContentStore(state.content);

// Wire up the stores with the actions.
navStore.registerActions(NavActions);
contentStore.registerActions(ContentActions);

co(function*() {
  const routeModel   = yield navStore.getModel();
  const initialIndex = routeModel.get('index');

  const contentModel   = yield contentStore.getModel();
  const initialContent = contentModel.get('content');

  return {
    navRoutes     : state.navRoutes,
    navStore      : navStore,
    contentStore  : contentStore,
    initialIndex  : initialIndex,
    initialContent: initialContent
  };
}).then(props => React.render(Root(props), document.getElementById('main')));
