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

    // The contentModelState subject is subscribed to updates
    // on the content model (actions applied to the model).
    this.contentModelSource
      .combineLatest(this.actionReceiver,
      (contentModel, action)=> {
        return action(contentModel);
      })
      .concatAll()
      .filter(contentModel => {
        return Object.keys(contentModel).length > 0;
      })
      .subscribe(this.contentModelState);
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

  /**
   * @returns {Promise} Promise that resolves to the content model.
   */
  get() {
    return this.contentModelState.first().toPromise();
  }
}

module.exports = Store;
