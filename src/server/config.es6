const glob  = require('glob');
const path  = require('path');
const nconf = require('nconf');

const production = nconf.get('NODE_ENV') === 'production';
const staticDir  = nconf.get('STATIC_DIR');
const dbProto    = nconf.get('COUCHDB_PORT_5984_TCP_PROTO');
const dbAddr     = nconf.get('COUCHDB_PORT_5984_TCP_ADDR');
const dbPort     = nconf.get('COUCHDB_PORT_5984_TCP_PORT');
const dbName     = nconf.get('COUCHDB_NAME');

const versions = Object.freeze({
  jquery    : '2.1.3',
  underscore: '1.8.3',
  react     : '0.13.3',
  rxjs      : '2.5.2',
  pouchdb   : '3.5.0',
  cookies   : '1.2.1'//,
  //showdown  : '1.0.0-alpha1' // currently unavailable at cdnjs
});

const dbPrivateBaseURL = `${dbProto}://${dbAddr}:${dbPort}`;
const dbPublicBaseURL = nconf.get('COUCHDB_PUBLIC_ADDR') || dbPrivateBaseURL;

const cdnURL = 'https://cdnjs.cloudflare.com';

const config = Object.freeze({
  dbName          : dbName,
  dbPrivateAddress: `${dbPrivateBaseURL}/${dbName}`,
  dbPublicAddress : `${dbPublicBaseURL}/${dbName}`,
  stylesheets: glob.sync(`${staticDir}/*.css`).map(path.basename),
  scripts    : glob.sync(`${staticDir}/*.js`).map(path.basename),
  externalScripts: [
    `${cdnURL}/ajax/libs/underscore.js/${versions.underscore}/underscore${production ? '-min' : ''}.js`,
    `${cdnURL}/ajax/libs/jquery/${versions.jquery}/jquery${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/react/${versions.react}/react${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/rxjs/${versions.rxjs}/rx.all${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/pouchdb/${versions.pouchdb}/pouchdb${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/Cookies.js/${versions.cookies}/cookies${production ? '.min' : ''}.js`//,
    //`${cdnURL}/ajax/libs/showdown/${versions.showdown}/showdown${production ? '.min' : ''}.js`
  ],
  allScripts: function () {
    return this.externalScripts.concat(this.scripts);
  }
});

module.exports = config;
