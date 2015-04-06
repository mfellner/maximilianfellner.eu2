/* global getAppConfig: false */

require('bootstrap/less/bootstrap.less');

require(['react', './nav-actions.es6', './nav-store.es6'], (React, NavActions, NavStore) => {

  const Root     = React.createFactory(require('../jsx/root.jsx'));
  const navStore = new NavStore();

  const rootProps = {
    navStore : navStore,
    navRoutes: getAppConfig().navRoutes
  };

  // Wire up the store with the actions.
  NavActions.register(navStore.updates);

  // Register callback for the first route-update to be put into the store.
  navStore.navState.first().subscribe(function (x) {
    React.render(Root(rootProps), document.getElementById('main'));
  });

  // Send the current route to the store.
  NavActions.navigateTo.onNext(getAppConfig().route);
});
