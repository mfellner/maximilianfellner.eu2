/* global STATE_COOKIE_NAME: false */

require('bootstrap/less/bootstrap.less');

require(['react', 'cookies-js',
  './nav-actions.es6', './nav-store.es6', './content-actions.es6', './content-store.es6'
], (React, Cookies, NavActions, NavStore, ContentActions, ContentStore) => {

  const Root = React.createFactory(require('../jsx/root.jsx'));

  // Read and expire the temporary cookie with the initial application state.
  const state = JSON.parse(Cookies.get(STATE_COOKIE_NAME));
  Cookies.expire(STATE_COOKIE_NAME);

  const rootProps = {
    navRoutes   : state.navRoutes,
    navStore    : new NavStore(state.nav),
    contentStore: new ContentStore(state.content)
  };

  // Wire up the stores with the actions.
  NavActions.register(rootProps.navStore.updates);
  ContentActions.register(rootProps.contentStore.updates);

  React.render(Root(rootProps), document.getElementById('main'));
});
