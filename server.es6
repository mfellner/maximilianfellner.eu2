const app    = require('koa')();
const router = require('koa-router')();
const serve  = require('koa-static');
const nconf  = require('nconf');

require('node-jsx').install({extension: '.jsx', harmony: true});

nconf
  .argv()
  .env()
  .file({file: 'config.json'});

app
  .use(function* logger(next) {
    const start = new Date();
    yield next;
    const ms = new Date() - start;
    console.log('%s %s - %s ms', this.method, this.url, ms);
  })
  .use(require('./routes/index'))
  .use(require('./routes/api'))
  .use(router.allowedMethods())
  .use(serve(__dirname + '/pack', {
    defer: true
  }));

app.listen(nconf.get('APP_PORT'));

console.log(`running app in ${app.env} mode`);
console.log(`listening on port ${nconf.get('APP_PORT')}`);
