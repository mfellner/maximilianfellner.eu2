import PouchDB  from 'pouchdb';

import logger from './logger.es6';
import config from './config.es6';

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

// Directly connect to the remote database on the server-side.
logger.log('info', '[PouchDB] NEW %s', config.dbPrivateAddress);

let db = new PouchDB(config.dbPrivateAddress, {
  auth: {
    username: config.dbUser,
    password: config.dbPass
  }
});

db.updateOrCreateContent = updateOrCreateContent;

db.info().then(result => {
  logger.log('info', '[PouchDB] connected to %s', result.host || result.db_name);
  logger.log('debug', '[PouchDB]', result);
}).catch(err => {
  logger.log('error', '[PouchDB]', err);
});

export default db;
