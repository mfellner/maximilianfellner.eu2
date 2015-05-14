const PouchDB  = require('pouchdb');

const logger   = require('./logger.es6');
const config   = require('./config.es6');
const isomorph = require('../util/isomorph.es6');

/**
 * Helper function to populate the database with
 * initial static content on the server side.
 *
 * @param {string} id Database ID of the content.
 * @param {object} content
 */
function* updateOrCreateContent(id, content) {
  try {
    const doc = yield this.get(id);

    yield this.put({
      _id    : id,
      _rev   : doc._rev,
      content: content
    });

    logger.log('info', '[PouchDB] updated existing content "%s"', id);

  } catch (e) {
    if (e.error && e.reason === 'missing') {
      logger.log('info', '[PouchDB] create missing content "%s"', id);

      yield this.put({
        _id    : id,
        content: content
      });
    } else {
      logger.log('error', '[PouchDB]', e);
      yield Promise.reject(e);
    }
  }
}

let exportedDB = null;

if (isomorph.isClientside()) {
  // Replicate the remote database in the browser.
  logger.log('info', '[PouchDB] NEW %s', config.dbPublicAddress);

  let remoteDB = new PouchDB(config.dbPublicAddress);

  // Use a local database on the client-side.
  const dbName  = `${config.dbName}-local`;
  const localDB = new PouchDB(dbName);

  PouchDB.replicate(remoteDB, localDB, {
    live : true,
    retry: true
  });

  exportedDB = localDB;

} else {
  // Directly connect to the remote database on the server-side.
  logger.log('info', '[PouchDB] NEW %s', config.dbPrivateAddress);

  let remoteDB = new PouchDB(config.dbPrivateAddress);
  remoteDB.updateOrCreateContent = updateOrCreateContent;

  exportedDB = remoteDB;
}

exportedDB.info().then(function (result) {
  logger.log('info', '[PouchDB] connected to %s', result.host || result.db_name);
  logger.log('debug', '[PouchDB]', result);
}).catch(function (err) {
  logger.log('error', '[PouchDB]', err);
});

module.exports = exportedDB;
