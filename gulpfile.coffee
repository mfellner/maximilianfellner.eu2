fs         = require 'fs'
del        = require 'del'
path       = require 'path'
gulp       = require 'gulp'
gutil      = require 'gulp-util'
rename     = require 'gulp-rename'
shell      = require 'gulp-shell'
cleancss   = require 'less-plugin-clean-css'
autoprefix = require 'less-plugin-autoprefix'
webpack    = require 'webpack'
nodemon    = require 'nodemon'
deepExtend = require 'deep-extend'
nconf      = require 'nconf'
argv       = require('yargs').argv

ExtractText = require 'extract-text-webpack-plugin'

nconf
  .env()
  .file(file: 'config.json');

src =
  js  :
    client: './src/client/main.es6'
    server: './src/server/server.es6'
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
  build : './build/'
  client: './build/client/'
  server: './build/server/'

# WebPack tasks
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

clientConf =
  entry : src.js.client
  output:
    path    : dst.client
    filename: "client-[hash]#{if argv.production? then '.min' else ''}.js"
  resolve:
    modulesDirectories: [
      'bower_components',
      'node_modules'
    ]
  module:
    loaders: [
      {
        test: /\.less$/
        loader: ExtractText.extract('style', 'css!less?strictMath')
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
    plugins.push new webpack.IgnorePlugin(/server\//, /shared/)
    plugins.push new webpack.optimize.UglifyJsPlugin() if argv.production?
    plugins.push new ExtractText("[contenthash]#{if argv.production? then '.min' else ''}.css")
    plugins
  externals:
#    'jquery'    : 'jQuery'
#    'underscore': '_'
    'react'     : 'React'
    'rx'        : 'Rx'
    'pouchdb'   : 'PouchDB'
    'cookies-js': 'Cookies'
    'showdown'  : 'showdown'

serverExternals = ->
  fs.readdirSync('node_modules')
  .filter (m) -> m.match /^[a-z0-9-]+$/i;
  .map (m) -> "#{m}": "commonjs #{m}"
  .concat
      'mz/fs': 'commonjs mz/fs'

serverConf =
  entry : src.js.server
  output:
    path    : dst.server
    filename: "server#{if argv.production? then '.min' else ''}.js"
  target: 'node'
  resolve:
    modulesDirectories: [
      'node_modules'
    ]
  module:
    loaders: [
      {test: /\.(ttf|eot|svg|woff2?)$/, loader: 'file'},
      {test: /\.jsx$/, loader: 'jsx-loader?harmony'}
      {test: /\.es6$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime'}
      {test: /\.json$/, loader: 'json-loader'},
    ]
  plugins: [
    new webpack.IgnorePlugin(/client\//, /shared/)
  ]
  externals:
    serverExternals()

once = (f) -> done = no; -> (f.apply this, arguments; done = yes) unless done

onWebPackBuild = (done) ->
  defaultOptions =
    colors      : gutil.colors.supportsColor
    hash        : no
    timings     : no
    chunks      : no
    chunkModules: no
    modules     : no
    children    : yes
    version     : yes
    cached      : no
    cachedAssets: no
    reasons     : no
    source      : no
    errorDetails: no

  (err, stats) ->
    if err
      throw new gutil.PluginError('webpack', message: err)
    else
      options = if argv.verbose then {colors: gutil.colors.supportsColor} else defaultOptions
      gutil.log stats.toString(options)
    if done then done()

gulp.task 'webpack:client', ['clean:client'], (done) ->
  webpack clientConf
  .run onWebPackBuild(done)

gulp.task 'webpack:server', ['clean:server'], (done) ->
  webpack serverConf
  .run onWebPackBuild(done)

gulp.task 'webpack:client:watch', ['clean:client'], (done) ->
  webpack clientConf
  .watch 100, onWebPackBuild(once done)

gulp.task 'webpack:server:watch', ['clean:server'], (done) ->
  callback = onWebPackBuild(once done)
  webpack serverConf
  .watch 100, (err, stats) ->
    callback(err, stats)
    nodemon.restart()

gulp.task 'webpack', ['webpack:client', 'webpack:server']

# Docker tasks
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

dockerBuild = (name) -> [
  "docker build -t #{docker.user}/#{docker[name].name}:#{docker[name].version} #{docker[name].dir}"
]

dockerRun = (name, args = '') -> [
  "docker run --rm -p #{docker[name].port}:#{docker[name].port}
  --name #{docker[name].name} #{args} #{docker.user}/#{docker[name].name}:#{docker[name].version}"
]

gulp.task 'docker:build:db', shell.task dockerBuild('couchdb')

gulp.task 'docker:run:db', ['docker:build:db'], shell.task dockerRun('couchdb')

gulp.task 'docker:build:app', ['build'], shell.task dockerBuild('app')

gulp.task 'docker:run:app', ['docker:build:app'], shell.task(
  dockerRun('app',
    "--link #{docker.couchdb.name}:#{docker.couchdb.name}
    -e \"COUCHDB_PUBLIC_ADDR=#{nconf.get('COUCHDB_PUBLIC_ADDR')}\"")
)

gulp.task 'docker:run', ['docker:run:app', 'docker:run:db']

gulp.task 'docker:clean', shell.task [
  "docker images --no-trunc=true --filter dangling=true --quiet | xargs docker rmi"
  "docker ps -a | grep Exit | cut -d ' ' -f 1 | xargs docker rm"
]

# Other tasks
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task 'run:watch', ['webpack:client:watch', 'webpack:server:watch'], ->
  nodemon
    script: './build/server/server*.js'
    execMap:
      'js' : 'node --harmony'
      'es6': 'node --harmony'
    ignore: ['*']
    watch : ['foobar/']
    ext   : 'foobar'

gulp.task 'clean:client', ->
  del(dst.client)

gulp.task 'clean:server', ->
  del(dst.server)

gulp.task 'clean', ->
  del(dst.build)

gulp.task 'build', ['webpack']

gulp.task 'default', ['build']
