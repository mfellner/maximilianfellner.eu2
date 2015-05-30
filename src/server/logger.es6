const nconf = require('nconf');
const winston = require('winston');

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
