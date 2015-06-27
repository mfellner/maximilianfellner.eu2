import db from '../database.es6';

export function* dbInfo() {
  return this.body = yield db.info();
}
