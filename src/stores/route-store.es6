const Store = require('./store.es6');
const Route = require('./../model/route.es6');

class RouteStore extends Store {

  constructor(model = {}) {

    super(new Route(model));

    // The contentModelState subject is subscribed to updates
    // on the content model (actions applied to the model).
    this.contentModelSource
      .combineLatest(this.actionReceiver,
      (contentModel, action)=> {
        return action(contentModel);
      })
      .filter(contentModel => {
        return contentModel.isValid();
      })
      .subscribe(this.contentModelState);
  }

  /**
   * @returns {Promise} Promise that resolves to the content model.
   */
  get() {
    return this.contentModelState.first().toPromise();
  }
}

module.exports = RouteStore;
