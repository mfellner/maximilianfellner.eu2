const Rx = require('rx');

class Store {

  constructor(model = {}) {
    /**
     * Subject to receive actions.
     * @type {Rx.Subject}
     */
    this.actionReceiver = new Rx.Subject();

    /**
     * Subject for the current model state.
     * @type {Rx.Subject}
     */
    this.contentModelState = new Rx.Subject();

    /**
     * Source subject of the content model.
     * @type {Rx.BehaviorSubject}
     */
    this.contentModelSource = new Rx.BehaviorSubject(model);
  }

  /**
   * Register a dispatcher of actions.
   * @param actions {Object} Actions to subscribe to the action receiver.
   */
  registerActions(actions) {
    actions.register(this.actionReceiver);
  }

  /**
   * Subscribe to the current state of the content model.
   * @param arguments {Arguments|Array} onNext, onError, onCompleted
   */
  subscribe() {
    this.contentModelState.subscribe.apply(this.contentModelState, arguments);
  }
}

module.exports = Store;
