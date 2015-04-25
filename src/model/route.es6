const Backbone = require('backbone');

const Route = Backbone.Model.extend({
  idAttribute: 'index',
  validate   : (attrs, options) => {
    if (!attrs || typeof attrs.index !== 'number' || !attrs.name || !attrs.path) {
      return 'model is invalid';
    }
  }
});

module.exports = Route;
