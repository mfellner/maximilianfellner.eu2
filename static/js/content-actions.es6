const Rx = require('rx');

const dummyContent = {
  '/'     : '<h3>Home</h3>',
  '/about': '<h3>About</h3>'
};

class ContentActions {
  static register(updates) {
    this.get
      .map(path => {
        return contentStore => {
          contentStore.content = dummyContent[path] || '<h3>Not Found</h3>';
          return contentStore;
        };
      })
      .subscribe(updates);
  }
}

ContentActions.get = new Rx.Subject();

module.exports = ContentActions;
