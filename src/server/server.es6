const app    = require('koa')();
const router = require('koa-router')();
const logger = require('koa-logger')();
const serve  = require('koa-static');
const co     = require('co');
const fs     = require('mz/fs');
const nconf  = require('nconf')
  .argv()
  .env()
  .file({file: 'config.json'});

require('node-jsx').install({extension: '.jsx', harmony: true});

// Initialize database with static content.
co(function*() {
  const db = require('./database');
  yield db.updateOrCreateContent('home', yield fs.readFile('./static/md/home.md', 'utf8'));
  yield db.updateOrCreateContent('about', yield fs.readFile('./static/md/about.md', 'utf8'));
}).catch(e => console.error(e));

app
  .use(logger)
  .use(require('./routes/index'))
  .use(require('./routes/api'))
  .use(router.allowedMethods())
  .use(serve(__dirname + '/../../pack', {
    defer: true
  }));

app.listen(nconf.get('APP_PORT'));

console.log(`running app in ${app.env} mode`);
console.log(`listening on port ${nconf.get('APP_PORT')}`);
