/* global getAppConfig: false */

require('bootstrap/less/bootstrap.less');

require(['react', './nav-actions.es6', './nav-store.es6'], (React, NavActions, NavStore) => {

  // Wire up the store with the actions.
  const navStore = new NavStore({
    route: getAppConfig().route
  });
  new NavActions().register(navStore.updates);

  const rootProps = {
    navStore : navStore,
    navRoutes: getAppConfig().navRoutes
  };

  // Render the root component.
  const Root = React.createFactory(require('../jsx/root.jsx'));
  React.render(Root(rootProps), document.getElementById('main'));
});
