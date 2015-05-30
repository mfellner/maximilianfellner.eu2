const isomorph = require('./../util/isomorph.es6');

if (isomorph.isServerside()) {
  module.exports = require('./../server/logger.es6');
} else {
  module.exports = require('./../client/logger.es6');
}
