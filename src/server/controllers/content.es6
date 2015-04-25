const db = require('../database');

module.exports.pageContent = function*(next) {
  if ('GET' != this.method) return yield next;
  return this.body = yield db.get(this.params.key);
};

module.exports.dbInfo = function*() {
  return this.body = yield db.info();
};
