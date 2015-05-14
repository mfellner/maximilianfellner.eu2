require('bootstrap/less/bootstrap.less');
require('babel/polyfill');

const React = require('react');

const db             = require('../shared/database.es6');
const config         = require('./config.es6');
const NavActions     = require('../actions/nav-actions.es6');
const ContentActions = require('../actions/content-actions.es6');
const RouteStore     = require('../stores/route-store.es6');
const ContentStore   = require('../stores/content-store.es6');

const Root = React.createFactory(require('../jsx/root.jsx'));

const routeStore   = new RouteStore();
const contentStore = new ContentStore();

// Wire up the stores with the actions.
routeStore.registerActions(NavActions);
contentStore.registerActions(ContentActions);

// Create the initial props and mount the root component.
Promise
  .all([
    db.get('routes'),
    routeStore.get(),
    contentStore.get()])
  .then(([
    routes,
    routeModel,
    contentModel]) => {

    console.log('[main] routes:', routes);
    console.log('[main] routeModel:', routeModel);
    console.log('[main] contentModel:', contentModel);

    const initialIndex   = routeModel.get('index');
    const initialContent = contentModel.content;

    return {
      navRoutes     : routes.content,
      routeStore    : routeStore,
      contentStore  : contentStore,
      initialIndex  : initialIndex,
      initialContent: initialContent
    };
  })
  .then(props => {
    React.render(Root(props), document.getElementById('main'))
  });

// Initialize the stores with initial data.
NavActions    .navigateTo.onNext(config.route);
ContentActions.get       .onNext(config.route);
