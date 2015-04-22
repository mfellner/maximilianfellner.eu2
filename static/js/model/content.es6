const Backbone = require('Backbone');

const Content = Backbone.Model.extend({
  urlRoot    : '/api/content',
  idAttribute: '_id',
  validate   : (attrs, options) => {
    if (!attrs || !attrs._id || !attrs.content) {
      return 'model is invalid';
    }
  }
});

module.exports = Content;
