const Store = require('./store.es6');

class ContentStore extends Store {

  constructor(model = {}) {

    super(model);

    // The contentModelState subject is subscribed to updates
    // on the content model (actions applied to the model).
    this.contentModelSource
      .combineLatest(this.actionReceiver,
      (contentModel, action)=> {
        return action(contentModel);
      })
      .concatAll()
      .filter(contentModel => {
        return !!contentModel._id;
      })
      .subscribe(this.contentModelState);
  }
}

module.exports = ContentStore;
