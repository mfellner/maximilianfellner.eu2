if (!process.env.MOCHA_DOCKER || process.env.MOCHA_DOCKER === 'false') {
  require('babel/register');
  const supertest = require('supertest');
  const nconf = require('nconf')
    .env()
    .overrides({
      'COUCHDB_PRIVATE_ADDR': './test',
      'COUCHDB_NAME': 'test.db'
    });

  // Ignore .svg files.
  require.extensions['.svg'] = function () {return null;};

  const server = require('../../src/server/server.es6');

  var request;

  before(function (done) {
    server.then(function (app) {
      request = supertest.agent(app.listen(nconf.get('APP_PORT')));
      done();
    });
  });

  require('./server-test')(function () { return request;});
}
