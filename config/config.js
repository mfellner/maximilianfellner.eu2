const production = process.env.NODE_ENV === 'production';

const config = {
  navRoutes: [
    {index: 0, name: 'Home',  path: '/'},
    {index: 1, name: 'About', path: '/about'}
  ],
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
