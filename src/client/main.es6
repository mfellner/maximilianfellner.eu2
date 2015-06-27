import 'bootstrap/less/bootstrap.less';

import React from 'react';

import db             from './database.es6';
import config         from './config.es6';
import NavActions     from '../actions/nav-actions.es6';
import ContentActions from '../actions/content-actions.es6';
import RouteStore     from '../stores/route-store.es6';
import ContentStore   from '../stores/content-store.es6';
import root           from '../jsx/root.jsx';

const routeStore   = new RouteStore();
const contentStore = new ContentStore();
const Root         = React.createFactory(root);

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

    const initialIndex   = routeModel.index;
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
