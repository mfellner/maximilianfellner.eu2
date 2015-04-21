const Rx = require('rx');

class NavActions {
  static register(updates) {
    this.navigateTo
      .map(route => {
        return routeModel => {
          return routeModel.set(route);
        };
      })
      .subscribe(updates);
  }
}

NavActions.navigateTo = new Rx.Subject();

module.exports = NavActions;
