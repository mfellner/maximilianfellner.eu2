del        = require 'del'
path       = require 'path'
gulp       = require 'gulp'
rename     = require 'gulp-rename'
webpack    = require 'gulp-webpack'
nodemon    = require 'gulp-nodemon'
cleancss   = require 'less-plugin-clean-css'
autoprefix = require 'less-plugin-autoprefix'
argv       = require('yargs').argv

src =
  js  : './static/js/main.es6'
  less: './static/less/main.less'

dst =
  css : './static/css/main.min.css'
  pack: './pack/main.min.js'


gulp.task 'webpack', ['clean'], ->
  @WebPack     = require 'webpack'
  @ExtractText = require 'extract-text-webpack-plugin'

  gulp.src src.js
  .pipe webpack
    output:
      filename: path.basename dst.pack
    resolve:
      modulesDirectories: [
        'bower_components',
        'node_modules'
      ]
    externals:
      'react': 'React'
    module:
      loaders: [
        {
          test: /\.less$/
          loader: @ExtractText.extract('style', 'css!less?strictMath')
        },
        {test: /\.(ttf|eot|svg|woff2?)$/, loader: 'file'},
        {test: /\.jsx$/, loader: 'jsx-loader?harmony'}
        {test: /\.es6$/, exclude: /node_modules/, loader: 'babel-loader?experimental=optional=runtime'}
      ]
    lessLoader:
      lessPlugins: [
        new cleancss
          advanced           : not argv.production?
          keepBreaks         : not argv.production?
          keepSpecialComments: not argv.production?
        new autoprefix
      ]
    plugins: do =>
      plugins = []
      plugins.push new @WebPack.optimize.UglifyJsPlugin() if argv.production?
      plugins.push new @ExtractText('[name].min.css')
      plugins
  .pipe gulp.dest(path.dirname dst.pack)


gulp.task 'run', ['build'], ->
  nodemon
    execMap:
      'es6': 'babel-node --extensions ".es6" --harmony'
    ext: 'es6 jsx'


gulp.task 'clean', ->
  del(path.dirname dst.pack)

gulp.task 'build', ['webpack']

gulp.task 'default', ['build']
