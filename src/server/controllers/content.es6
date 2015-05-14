const db = require('../../shared/database.es6');

module.exports.dbInfo = function*() {
  return this.body = yield db.info();
};
