const nconf = require('nconf');

const production = nconf.get('NODE_ENV') === 'production';
const cdnURL = 'https://cdnjs.cloudflare.com';

const versions = {
  jquery    : '2.1.3',
  underscore: '1.8.3',
  react     : '0.13.1',
  backbone  : '1.1.2'
};

const config = {
  navRoutes: [
    {index: 0, name: 'Home', path: '/'},
    {index: 1, name: 'About', path: '/about'}
  ],
  stylesheets: [
    '/main.min.css'
  ],
  scripts: [
    '/main.min.js'
  ],
  externalScripts: [
    `${cdnURL}/ajax/libs/underscore.js/${versions.underscore}/underscore${production ? '-min' : ''}.js`,
    `${cdnURL}/ajax/libs/jquery/${versions.jquery}/jquery${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/react/${versions.react}/react${production ? '.min' : ''}.js`,
    `${cdnURL}/ajax/libs/backbone.js/${versions.backbone}/backbone${production ? '-min' : ''}.js`
  ],
  allScripts: function () {
    return this.externalScripts.concat(this.scripts);
  }
};

module.exports = config;
