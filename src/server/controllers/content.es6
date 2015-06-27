import db from '../../shared/database.es6';

export function* dbInfo() {
  return this.body = yield db.info();
}
