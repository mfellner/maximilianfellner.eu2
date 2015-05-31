const koa    = require('koa');
const router = require('koa-router');
const serve  = require('koa-static');
const co     = require('co');
const path   = require('path');
const nconf  = require('nconf')
  .argv()
  .env()
  .file({file: 'config.json'});

const logger = require('../shared/logger.es6');

const indexRoute = require('./routes/index.es6');
const apiRoute   = require('./routes/api.es6');

function* koaLog(next) {
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  logger.log('debug', '%s %s %d - %s ms', this.method, this.url, this.status, ms);
}

function*initKoa() {
  logger.log('debug', '[SERVER] initKoa');
  return koa()
    .use(koaLog)
    .use(yield indexRoute.init())
    .use(apiRoute)
    .use(router().allowedMethods())
    .use(serve(nconf.get('STATIC_DIR'), {
      defer: true
    }));
}

function*appRun() {
  try {
    // Initialize the database with static content.
    yield require('./db-init.es6').init();
  } catch (e) {
    logger.log('error', '[SERVER] cannot initialize database', e)
  }

  const app = yield initKoa();
  app.listen(nconf.get('APP_PORT'));

  logger.log('info', '[SERVER] running app in %s mode', app.env);
  logger.log('info', '[SERVER] listening on port %s', nconf.get('APP_PORT'));
}

const errorLog = e => logger.log('error', '[SERVER]', e);

if (require.main === module) {
  co(appRun).catch(errorLog);
} else {
  module.exports = co(initKoa).catch(errorLog);
}
