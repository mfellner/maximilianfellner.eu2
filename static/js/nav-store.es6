const Rx       = require('rx');
const deepcopy = require('deepcopy');

class NavStore {

  constructor(store = {}) {

    const NAV_STATE = deepcopy(store);

    this.get = () => NAV_STATE;

    this.updates = new Rx.BehaviorSubject(NAV_STATE);

    const navState = new Rx.Subject();

    this.subscribe = function () {
      navState.subscribe.apply(navState, arguments);
    };

    this.firstUpdate = function () {
      return navState.first();
    };

    this.updates
      .scan((navState, operation) => {
        return operation(navState);
      })
      .filter(navState => {
        return !!navState.route;
      })
      .subscribe(navState);
  }
}

module.exports = NavStore;
