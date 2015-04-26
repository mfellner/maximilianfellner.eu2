const PouchDB  = require('pouchdb');
const config   = require('./config.es6');
const isomorph = require('../util/isomorph.es6');

const remoteDB = new PouchDB(config.dbAddress);

/**
 * Helper function to populate the database with
 * initial static content on the server side.
 *
 * @param {string} id Database ID of the content.
 * @param {object} content
 */
remoteDB.updateOrCreateContent = function*(id, content) {
  try {
    const doc = yield remoteDB.get(id);

    yield remoteDB.put({
      _id    : id,
      _rev   : doc._rev,
      content: content
    });
  } catch (e) {
    if (e.error && e.reason === 'missing') {
      yield remoteDB.put({
        _id    : id,
        content: content
      });
    } else {
      yield Promise.reject(e);
    }
  }
};

// Replicate the remote database in the browser.
if (isomorph.isClientside()) {
  const dbName  = `${config.dbName}-local`;
  const localDB = new PouchDB(dbName);

  PouchDB.replicate(remoteDB, localDB, {
    live : true,
    retry: true
  });

  module.exports = localDB; // Use a local database on the client-side.
} else {
  module.exports = remoteDB; // Use the remote database on the server-side.
}
