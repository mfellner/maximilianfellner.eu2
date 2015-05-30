require('babel/register');

const supertest = require('supertest');
const should    = require('should');
const nconf     = require('nconf').env();

const dockerTest = !!process.env.MOCHA_DOCKER;

if (!dockerTest) {
  // Use local test DB.
  nconf.overrides({
    'COUCHDB_PRIVATE_ADDR': './test',
    'COUCHDB_NAME': 'test.db'
  });
}

const server = require('../../src/server/server.es6');

// Ignore .svg files.
require.extensions['.svg'] = function () {return null;};

var request;

before(function (done) {
  if (dockerTest) {
    // Run tests against Docker containers.
    request = supertest(nconf.get('APP_PUBLIC_ADDR'));
    done();
  } else {
    server.then(function (app) {
      request = supertest.agent(app.listen(nconf.get('APP_PORT')));
      done();
    });
  }
});

describe('Server API', function () {

  it('returns the database info', function (done) {
    request
      .get('/api/db')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('Server routes', function () {

  it('returns the index page', function (done) {
    request
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('returns the about page', function (done) {
    request
      .get('/about')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('sets a cookie', function (done) {
    request
      .get('/')
      .end(function (err, res) {
        should.not.exist(err);

        res.headers['set-cookie'].should
          .be.instanceof(Array).and
          .have.lengthOf(1);

        res.headers['set-cookie'][0].should.match(/.+=.+;/);

        const cookie = JSON.parse(res
          .headers['set-cookie'][0]
          .split(';')[0]
          .split('=')[1]);

        cookie.should.have.property('dbName').which.is.a.String;
        cookie.should.have.property('dbPublicAddress').which.is.a.String;
        cookie.should.have.property('route').which.is.a.Object;
        cookie.route.should.have.property('path').which.is.exactly('/');
        done();
      });
  });
});
