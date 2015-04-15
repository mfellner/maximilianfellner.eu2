const Rx       = require('rx');
const deepcopy = require('deepcopy');

class NavStore {

  constructor(store = {}) {

    const CONTENT_STORE = deepcopy(store);

    this.get = () => CONTENT_STORE;

    this.updates = new Rx.BehaviorSubject(CONTENT_STORE);

    const contentState = new Rx.Subject();

    this.subscribe = function () {
      contentState.subscribe.apply(contentState, arguments);
    };

    this.firstUpdate = function () {
      return contentState.first();
    };

    this.updates
      .scan((contentStore, operation) => {
        return operation(contentStore);
      })
      .filter(contentStore => {
        return !!contentStore.content;
      })
      .subscribe(contentState);
  }
}

module.exports = NavStore;
