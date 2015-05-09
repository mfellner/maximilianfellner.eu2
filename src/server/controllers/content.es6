const db = require('../../shared/database');

module.exports.dbInfo = function*() {
  return this.body = yield db.info();
};
