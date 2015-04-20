const Rx = require('rx');

const Route = require('./route.es6');

class NavStore {

  constructor(model = {}) {
    /**
     * Subject to receive actions.
     * @type {Rx.Subject}
     */
    const actionReceiver = new Rx.Subject();

    /**
     * Subject for the current model state.
     * @type {Rx.Subject}
     */
    const contentModelState = new Rx.Subject();

    /**
     * Source subject of the content model.
     * @type {Rx.BehaviorSubject}
     */
    const contentModelSource = new Rx.BehaviorSubject(new Route(model));

    /**
     * @returns {Promise} Promise that resolves to the content model.
     */
    this.getModel = function () {
      return contentModelSource.first().toPromise();
    };

    /**
     * Register a dispatcher of actions.
     * @param actions {Object} Actions to subscribe to the action receiver.
     */
    this.registerActions = function (actions) {
      actions.register(actionReceiver);
    };

    /**
     * Subscribe to the current state of the content model.
     * @param arguments {Arguments|Array} onNext, onError, onCompleted
     */
    this.subscribe = function () {
      contentModelState.subscribe.apply(contentModelState, arguments);
    };

    // The contentModelState subject is subscribed to updates
    // on the content model (actions applied to the model).
    contentModelSource
      .combineLatest(actionReceiver,
      (contentModel, action)=> {
        return action(contentModel);
      })
      .filter(contentModel => {
        return contentModel.isValid();
      })
      .subscribe(contentModelState);
  }
}

module.exports = NavStore;
