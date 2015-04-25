const PouchDB = require('pouchdb');
const fs      = require('mz/fs');
const co      = require('co');
const config  = require('./config');

const db = new PouchDB(config.dbName);

function *updateOrCreateContent(id, content) {
  try {
    const doc = yield db.get(id);

    yield db.put({
      _id    : id,
      _rev   : doc._rev,
      content: content
    });
  } catch (e) {
    if (e.error && e.reason === 'missing') {
      yield db.put({
        _id    : id,
        content: content
      });
    } else {
      console.error(e);
    }
  }
}

co(function*() {
  yield updateOrCreateContent('home', yield fs.readFile('./static/md/home.md', 'utf8'));
  yield updateOrCreateContent('about', yield fs.readFile('./static/md/about.md', 'utf8'));
})
  .catch(e => console.error(e));

module.exports = db;
