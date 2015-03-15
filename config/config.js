const production = process.env.NODE_ENV === 'production';

const config = {
  stylesheets: [
    '/main.min.css'
  ],
  scripts: [
    '/main.min.js'
  ],
  externalScripts: [
    '//cdnjs.cloudflare.com/ajax/libs/react/0.13.0/react' + (production ? '.min' : '') + '.js'
  ],
  allScripts: function () {
    return this.externalScripts.concat(this.scripts);
  }
};

module.exports = config;
