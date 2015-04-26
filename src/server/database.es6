const PouchDB = require('pouchdb');
const config  = require('./config');

const db = new PouchDB(config.dbAddress);

db.updateOrCreateContent = function*(id, content) {
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
      yield Promise.reject(e);
    }
  }
};

module.exports = db;
