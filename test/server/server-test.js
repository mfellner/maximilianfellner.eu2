if (!process.env.MOCHA_DOCKER || process.env.MOCHA_DOCKER === 'false') {
  require('babel/register');
  const del       = require('del');
  const supertest = require('supertest');
  const nconf     = require('nconf')
    .env()
    .overrides({
      'COUCHDB_PRIVATE_ADDR': './test',
      'COUCHDB_NAME': 'test.db'
    });

  // Ignore .svg files.
  require.extensions['.svg'] = function () {return null;};

  del.sync('./test/test.db'); // Delete test database.

  const logger = require('../../src/server/logger.es6');
  const server = require('../../src/server/server.es6');

  var request;

  before(function (done) {
    server.then(function (app) {
      request = supertest.agent(app.listen());
      done();
    });
  });

  require('./testcases')(function () { return request;});
}
