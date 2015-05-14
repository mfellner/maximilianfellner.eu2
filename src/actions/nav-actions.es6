const Rx = require('rx');

class NavActions {
  static register(updates) {
    this.navigateTo
      .map(route => {
        return () => {
          return Promise.resolve(route);
        };
      })
      .subscribe(updates);
  }
}

NavActions.navigateTo = new Rx.Subject();

module.exports = NavActions;
