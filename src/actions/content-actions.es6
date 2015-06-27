import Rx         from 'rx';
import changeCase from 'change-case';
import db         from '../shared/database.es6';

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

export default ContentActions;
