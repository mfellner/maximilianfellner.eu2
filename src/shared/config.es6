const isomorph = require('./../util/isomorph.es6');

if (isomorph.isServerside()) {
  module.exports = require('./../server/config.es6'); // must be webpack-external in gulpfile.coffee
} else {
  module.exports = require('./../client/config.es6');
}
