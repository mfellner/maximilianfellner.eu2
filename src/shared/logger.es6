const isomorph = require('./../util/isomorph.es6');

if (isomorph.isServerside()) {
  const nconf   = require('nconf');   // must be webpack-external in gulpfile.coffee
  const winston = require('winston'); // must be webpack-external in gulpfile.coffee

  const production = nconf.get('NODE_ENV') === 'production';

  module.exports = new winston.Logger({
    transports: (function () {
      if (production) {
        return [new (winston.transports.Console)({level: 'info', timestamp: true})];
      } else {
        return [new (winston.transports.Console)({level: 'debug', timestamp: true, colorize: true})];
      }
    }())
  });
} else {
  module.exports = {
    log: function (name, ...args) {
      const log = console[name] || console.log;
      log.apply(console, args);
    }
  }
}
