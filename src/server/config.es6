import glob  from 'glob';
import path  from 'path';
import nconf from 'nconf';

nconf
  .argv()
  .env()
  .file({file: 'config.json'});

const production = nconf.get('NODE_ENV') === 'production';
const staticDir  = nconf.get('STATIC_DIR');
const dbProto    = nconf.get('COUCHDB_PORT_5984_TCP_PROTO');
const dbAddr     = nconf.get('COUCHDB_PORT_5984_TCP_ADDR');
const dbPort     = nconf.get('COUCHDB_PORT_5984_TCP_PORT');
const dbName     = nconf.get('COUCHDB_NAME');

const versions = Object.freeze({
  react     : '0.13.3',
  rxjs      : '2.5.3',
  pouchdb   : '3.6.0',
  cookies   : '1.2.1',
  showdown  : '1.1.0'
});

const dbPrivateBaseURL = nconf.get('COUCHDB_PRIVATE_ADDR') || `${dbProto}://${dbAddr}:${dbPort}`;
const dbPublicBaseURL  = `${nconf.get('COUCHDB_PUBLIC_URL')}:${nconf.get('COUCHDB_PUBLIC_PORT')}`;
const appPublicURL     = `${nconf.get('APP_PUBLIC_URL')}:${nconf.get('APP_PUBLIC_PORT')}`;

const cdnURL = 'https://cdnjs.cloudflare.com';

export default Object.freeze({
  isProduction    : production,
  appPort         : nconf.get('APP_PORT'),
  staticDir       : nconf.get('STATIC_DIR'),
  dbName          : dbName,
  dbUser          : nconf.get('COUCHDB_ADMIN_NAME'),
  dbPass          : nconf.get('COUCHDB_ADMIN_PASS'),
  dbPrivateAddress: `${dbPrivateBaseURL}/${dbName}`,
  dbPublicAddress : `${dbPublicBaseURL}/${dbName}`,
  appPublicAddress: `${appPublicURL}`,
  stylesheets: glob.sync(`${staticDir}/*.css`).map(path.basename),
  scripts    : glob.sync(`${staticDir}/*.js`).map(path.basename),
  externalScripts: [
    `${cdnURL}/ajax/libs/react/${versions.react}/react${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/rxjs/${versions.rxjs}/rx.all${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/pouchdb/${versions.pouchdb}/pouchdb${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/Cookies.js/${versions.cookies}/cookies${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/showdown/${versions.showdown}/showdown${production ? '.min' : ''}.js`
  ],
  allScripts: function () {
    return this.externalScripts.concat(this.scripts);
  }
});
