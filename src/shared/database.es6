const isomorph = require('../util/isomorph.es6');

if (isomorph.isServerside()) {
  module.exports = require('../server/database.es6');
} else {
  module.exports = require('../client/database.es6');
}
