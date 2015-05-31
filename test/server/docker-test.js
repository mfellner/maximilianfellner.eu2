if (process.env.MOCHA_DOCKER && process.env.MOCHA_DOCKER !== 'false') {
  require('babel/register');
  const supertest = require('supertest');
  const nconf     = require('nconf').env();

  const config = require('../../src/server/config.es6');

  var request;

  before(function (done) {
    // Run tests against Docker containers.
    console.log('Docker test ', config.appPublicAddress);
    request = supertest(config.appPublicAddress);
    done();
  });

  require('./server-test')(function () { return request;});
}
