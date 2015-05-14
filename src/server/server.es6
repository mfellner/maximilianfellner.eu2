const app    = require('koa')();
const router = require('koa-router')();
const serve  = require('koa-static');
const co     = require('co');
const nconf  = require('nconf')
  .argv()
  .env()
  .file({file: 'config.json'});

require('node-jsx').install({extension: '.jsx', harmony: true});

const logger = require('../shared/logger.es6');
const initDB = require('./db-init.es6');

// Initialize the database with static content.
co(initDB.initStatic()).catch(e => logger.log('error', '[SERVER] cannot initialize database', e));

const koaLog = function *(next) {
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  logger.log('debug', '%s %s - %s', this.method, this.url, ms);
};

app
  .use(koaLog)
  .use(require('./routes/index'))
  .use(require('./routes/api'))
  .use(router.allowedMethods())
  .use(serve(__dirname + '/../../pack', {
    defer: true
  }));

app.listen(nconf.get('APP_PORT'));

logger.log('info', 'running app in %s mode', app.env);
logger.log('info', 'listening on port %s', nconf.get('APP_PORT'));
