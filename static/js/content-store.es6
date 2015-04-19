const Rx       = require('rx');
const Backbone = require('backbone');

const Content = require('./content.es6');

class NavStore {

  constructor(model = {}) {

    const CONTENT_MODEL = new Content(model);

    //if (Backbone.ajax && Backbone.$ && !CONTENT_MODEL.isValid()) {
    //  console.log('CONTENT_MODEL.fetch');
    //  CONTENT_MODEL.fetch();
    //}

    this.get = function () {
      return CONTENT_MODEL.get.apply(CONTENT_MODEL, arguments);
    };

    this.actionReceiver = new Rx.Subject();

    const contentModelState = new Rx.Subject();

    /**
     * Subscribe to the current state of the content model.
     *
     * @param arguments (Arguments | Array) onNext, onError, onCompleted
     */
    this.subscribe = function () {
      contentModelState.subscribe.apply(contentModelState, arguments);
    };

    new Rx.BehaviorSubject(CONTENT_MODEL)
      .combineLatest(this.actionReceiver,
      (contentModel, action)=> {
        console.log('store.combineLatest:contentModel', contentModel);
        console.log('store.combineLatest:action', action);
        return action(contentModel);
      })
      .concatAll()
      .filter(contentModel => {
        console.log('store.filter:contentModel', contentModel);
        console.log('store.filter:contentModel.isValid', contentModel.isValid());
        return contentModel.isValid();
      })
      .subscribe(contentModelState);
  }
}

module.exports = NavStore;
