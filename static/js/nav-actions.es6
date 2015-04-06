const Rx = require('rx');

class NavActions {
  static register(updates) {
    this.navigateTo
      .map(route => {
        return navState => {
          navState.route = route;
          return navState;
        };
      })
      .subscribe(updates);
  }
}

NavActions.navigateTo = new Rx.Subject();

module.exports = NavActions;
