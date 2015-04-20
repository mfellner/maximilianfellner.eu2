const Rx         = require('rx');
const Backbone   = require('backbone');
const changeCase = require('change-case');

const Content = require('./content.es6');

class ContentActions {
  static register(updates) {
    this.get
      .map(route => {
        return contentModel => {
          if (!Backbone.ajax || !Backbone.$) return Rx.Observable.just(contentModel);

          return Rx.Observable.fromPromise(
            new Content({key: changeCase.param(route.name)})
              .fetch()
              .then(attrs => contentModel.set(attrs)));
        };
      })
      .subscribe(updates);
  }
}

ContentActions.get = new Rx.Subject();

module.exports = ContentActions;
