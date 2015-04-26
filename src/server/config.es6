const glob  = require('glob');
const path  = require('path');
const nconf = require('nconf');

const production = nconf.get('NODE_ENV') === 'production';
const staticDir  = nconf.get('STATIC_DIR');
const dbProtocol = nconf.get('COUCHDB_PROTOCOL');
const dbHost     = nconf.get('COUCHDB_HOST');
const dbPort     = nconf.get('COUCHDB_PORT');

const versions = {
  jquery    : '2.1.3',
  underscore: '1.8.3',
  backbone  : '1.1.2',
  react     : '0.13.2',
  rxjs      : '2.5.2',
  cookies   : '1.2.1',
  showdown  : '0.5.0'
};

const cdnURL = 'https://cdnjs.cloudflare.com';

const config = {
  dbAddress: `${dbProtocol}${dbHost}:${dbPort}/maximilianfellner-eu`,
  navRoutes: [
    {index: 0, name: 'Home', path: '/'},
    {index: 1, name: 'About', path: '/about'}
  ],
  stylesheets: glob.sync(`${staticDir}/*.css`).map(path.basename),
  scripts    : glob.sync(`${staticDir}/*.js`).map(path.basename),
  externalScripts: [
    `${cdnURL}/ajax/libs/underscore.js/${versions.underscore}/underscore${production ? '-min' : ''}.js`,
    `${cdnURL}/ajax/libs/jquery/${versions.jquery}/jquery${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/react/${versions.react}/react${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/backbone.js/${versions.backbone}/backbone${production ? '-min' : ''}.js`,
    `${cdnURL}/ajax/libs/rxjs/${versions.rxjs}/rx.all${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/Cookies.js/${versions.cookies}/cookies${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/showdown/${versions.showdown}/showdown${production ? '.min' : ''}.js`
  ],
  allScripts: function () {
    return this.externalScripts.concat(this.scripts);
  }
};

module.exports = config;
