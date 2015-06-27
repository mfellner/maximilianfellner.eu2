import PouchDB  from 'pouchdb';

import logger from './logger.es6';
import config from './config.es6';

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
//.on('complete', info => logger.log('info', '[PouchDB] complete', info))
//.on('active', () => logger.log('info', '[PouchDB] active'))
//.on('paused', () => logger.log('info', '[PouchDB] paused'))
//.on('change', info => logger.log('info', '[PouchDB] change', info))
//.on('denied', info => logger.log('error', '[PouchDB] denied', info))
//.on('error', err => logger.log('error', '[PouchDB] error', err));

localDB.info().then(result => {
  logger.log('info', '[PouchDB] connected to %s', result.host || result.db_name);
  logger.log('debug', '[PouchDB]', result);
}).catch(err => {
  logger.log('error', '[PouchDB]', err);
});

export default localDB;
