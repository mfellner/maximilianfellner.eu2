const Rx = require('rx');

class NavStore {

  constructor() {

    const NAV_STATE = {
      route: null
    };

    this.get = () => NAV_STATE;

    this.updates = new Rx.BehaviorSubject(NAV_STATE);

    this.navState = new Rx.Subject();

    this.updates
      .scan((navState, operation) => {
        return operation(navState);
      })
      .filter(navState => {
        return !!navState.route;
      })
      .subscribe(this.navState);
  }
}

module.exports = NavStore;
