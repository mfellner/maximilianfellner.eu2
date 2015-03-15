const app = require('koa')();
const router = require('koa-router')();
const serve = require('koa-static');

require('node-jsx').install({extension: '.jsx', harmony: true});
require.extensions['.less'] = function () {};

app
  .use(function* logger(next) {
    var start = new Date();
    yield next;
    var ms = new Date() - start;
    console.log('%s %s - %s', this.method, this.url, ms);
  })
  .use(require('./routes/index'))
  .use(router.allowedMethods())
  .use(serve(__dirname + '/pack', {
    defer: true
  }));

app.listen(3000);
console.log('running app in ' + app.env + ' mode');
console.log('listening on port 3000');
