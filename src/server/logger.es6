import nconf   from 'nconf';
import winston from 'winston';

import config from './config.es6';

export default new winston.Logger({
  transports: (() => {
    if (config.isProduction) {
      return [new (winston.transports.Console)({
        level    : 'info',
        timestamp: true
      })];
    } else {
      return [new (winston.transports.Console)({
        level      : 'debug',
        timestamp  : true,
        colorize   : true,
        prettyPrint: true
      })];
    }
  })()
});
