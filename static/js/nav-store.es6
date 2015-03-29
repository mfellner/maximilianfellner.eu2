const Rx = require('rx');

class NavStore {

  constructor(navState) {

    const NAV_STATE = navState || null;

    this.get = () => NAV_STATE;

    this.updates = new Rx.BehaviorSubject(NAV_STATE);

    this.navState = this.updates.scan((navState, operation) => {
      console.log('operation', operation);
      console.log('navState', navState);
      return operation(NAV_STATE);
    });
  }
}

module.exports = NavStore;
