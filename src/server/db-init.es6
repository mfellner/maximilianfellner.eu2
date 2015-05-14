const fs = require('mz/fs');

module.exports.initStatic = function*() {
  const db = require('../shared/database.es6');
  yield db.updateOrCreateContent('home', yield fs.readFile('./static/md/home.md', 'utf8'));
  yield db.updateOrCreateContent('about', yield fs.readFile('./static/md/about.md', 'utf8'));
};
