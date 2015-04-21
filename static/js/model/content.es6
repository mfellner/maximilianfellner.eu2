const Backbone = require('Backbone');

const Content = Backbone.Model.extend({
  urlRoot    : '/api/content',
  idAttribute: 'key',
  validate   : (attrs, options) => {
    if (!attrs || !attrs.key || !attrs.content) {
      return 'model is invalid';
    }
  }
});

module.exports = Content;
