const app    = require('koa')();
const router = require('koa-router')();
const serve  = require('koa-static');
const co     = require('co');
const nconf  = require('nconf')
  .argv()
  .env()
  .file({file: 'config.json'});

require('node-jsx').install({extension: '.jsx', harmony: true});

const logger      = require('../shared/logger.es6');
const initDB      = require('./db-init.es6');

const indexRoute  = require('./routes/index');
const apiRoute    = require('./routes/api.es6');

function* koaLog(next) {
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  logger.log('debug', '%s %s %d - %s ms', this.method, this.url, this.status, ms);
}

co(function*() {
  // Initialize the database with static content.
  try {
    yield initDB.init();
  } catch (e) {
    logger.log('error', '[SERVER] cannot initialize database', e)
  }

  app
    .use(koaLog)
    .use(yield indexRoute.init())
    .use(apiRoute)
    .use(router.allowedMethods())
    .use(serve(__dirname + '/../../pack', {
      defer: true
    }));

  app.listen(nconf.get('APP_PORT'));

  logger.log('info', '[SERVER] running app in %s mode', app.env);
  logger.log('info', '[SERVER] listening on port %s', nconf.get('APP_PORT'));
}).catch(e => {
  logger.log('error', '[SERVER]', e)
});
