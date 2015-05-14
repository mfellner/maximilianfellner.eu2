del        = require 'del'
path       = require 'path'
gulp       = require 'gulp'
rename     = require 'gulp-rename'
webpack    = require 'gulp-webpack'
nodemon    = require 'gulp-nodemon'
shell      = require 'gulp-shell'
cleancss   = require 'less-plugin-clean-css'
autoprefix = require 'less-plugin-autoprefix'
nconf      = require 'nconf'
argv       = require('yargs').argv

nconf
  .env()
  .file(file: 'config.json');

src =
  js  : './src/client/main.es6'
  less: './static/less/main.less'

docker =
  user: 'mfellner'
  couchdb:
    name   : 'couchdb'
    version: '1.6.1'
    dir    : './database'
    port   : nconf.get('COUCHDB_PORT_5984_TCP_PORT')
  app:
    name   : 'maximilianfellner.eu'
    version: '0.1.0'
    dir    : './'
    port   : nconf.get('APP_PORT')

dst =
  pack: path.normalize nconf.get('STATIC_DIR')


gulp.task 'webpack', ['clean'], ->
  @WebPack     = require 'webpack'
  @ExtractText = require 'extract-text-webpack-plugin'

  gulp.src src.js
  .pipe webpack
    output:
      filename: "[hash]#{if argv.production? then '.min' else ''}.js"
    resolve:
      modulesDirectories: [
        'bower_components',
        'node_modules'
      ]
    externals:
      'jquery'    : 'jQuery'
      'underscore': '_'
      'backbone'  : 'Backbone'
      'react'     : 'React'
      'rx'        : 'Rx'
      'pouchdb'   : 'PouchDB'
      'cookies-js': 'Cookies'
      'showdown'  : 'Showdown'
      'nconf'  : 'null' # prevent webpack from loading this server-side module
      'winston': 'null' # prevent webpack from loading this server-side module
      './../server/config.es6': 'null' # prevent webpack from loading this server-side module
    module:
      loaders: [
        {
          test: /\.less$/
          loader: @ExtractText.extract('style', 'css!less?strictMath')
        },
        {test: /\.(ttf|eot|svg|woff2?)$/, loader: 'file'},
        {test: /\.jsx$/, loader: 'jsx-loader?harmony'}
        {test: /\.es6$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime'}
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
      plugins.push new @ExtractText("[contenthash]#{if argv.production? then '.min' else ''}.css")
      plugins
  .pipe gulp.dest(dst.pack)


gulp.task 'run', ['build'], ->
  nodemon
    execMap:
      'es6': 'babel-node --extensions ".es6" --harmony'
    ext: 'es6 jsx'


dockerBuild = (name) -> [
  "docker build -t #{docker.user}/#{docker[name].name}:#{docker[name].version} #{docker[name].dir}"
]

dockerRun = (name, args = '') -> [
  "docker run --rm -p #{docker[name].port}:#{docker[name].port}
  --name #{docker[name].name} #{args} #{docker.user}/#{docker[name].name}:#{docker[name].version}"
]

gulp.task 'docker:build:db', shell.task dockerBuild('couchdb')

gulp.task 'docker:run:db', ['docker:build:db'], shell.task dockerRun('couchdb')

gulp.task 'docker:build:app', shell.task dockerBuild('app')

gulp.task 'docker:run:app', ['docker:build:app'], shell.task(
  dockerRun('app',
    "--link #{docker.couchdb.name}:#{docker.couchdb.name}
    -e \"COUCHDB_PUBLIC_ADDR=#{nconf.get('COUCHDB_PUBLIC_ADDR')}\"")
)

gulp.task 'docker:clean', shell.task [
  "docker images --no-trunc=true --filter dangling=true --quiet | xargs docker rmi"
  "docker ps -a | grep Exit | cut -d ' ' -f 1 | xargs docker rm"
]

gulp.task 'clean', ->
  del(dst.pack)

gulp.task 'build', ['webpack']

gulp.task 'default', ['build']
