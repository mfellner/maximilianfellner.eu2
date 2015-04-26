const Rx         = require('rx');
const changeCase = require('change-case');
const db         = require('../shared/database.es6');

class ContentActions {
  static register(updates) {
    this.get
      .map(route => {
        return () => {
          const promise = db.get(changeCase.param(route.name));
          return Rx.Observable.fromPromise(promise);
        }
      })
      .subscribe(updates);
  }
}

ContentActions.get = new Rx.Subject();

module.exports = ContentActions;
