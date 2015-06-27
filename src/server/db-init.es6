import fs from 'mz/fs';
import db from '../shared/database.es6';

/**
 * Initialize the database with static content.
 */
export function* init() {
  yield db.updateOrCreateContent('home',  yield fs.readFile('./static/md/home.md',  'utf8'));
  yield db.updateOrCreateContent('about', yield fs.readFile('./static/md/about.md', 'utf8'));

  const routesJSON = yield fs.readFile('./static/json/routes.json', 'utf8');

  yield db.updateOrCreateContent('routes', JSON.parse(routesJSON));
}
