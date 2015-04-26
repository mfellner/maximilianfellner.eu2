require('bootstrap/less/bootstrap.less');
require('babel/polyfill');

const React = require('react');

const config         = require('./config.es6');
const NavActions     = require('../actions/nav-actions.es6');
const ContentActions = require('../actions/content-actions.es6');
const RouteStore     = require('../stores/route-store.es6');
const ContentStore   = require('../stores/content-store.es6');

const Root = React.createFactory(require('../jsx/root.jsx'));

// Initialize the stores with initial data.
const routeStore   = new RouteStore(config.route);
const contentStore = new ContentStore(config.content);

// Wire up the stores with the actions.
routeStore.registerActions(NavActions);
contentStore.registerActions(ContentActions);

// Create the initial props and mount the root component.
Promise
  .all([
    routeStore.getModel(),
    contentStore.getModel()])
  .then(([
    routeModel,
    contentModel]) => {

    const initialIndex   = routeModel.get('index');
    const initialContent = contentModel.content;

    return {
      navRoutes     : config.navRoutes,
      routeStore    : routeStore,
      contentStore  : contentStore,
      initialIndex  : initialIndex,
      initialContent: initialContent
    };
  })
  .then(props => {
    React.render(Root(props), document.getElementById('main'))
  });
