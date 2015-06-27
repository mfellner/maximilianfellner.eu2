import koa    from 'koa';
import router from 'koa-router';
import serve  from 'koa-static';
import co     from 'co';
import path   from 'path';

import config from './config.es6';
import logger from './logger.es6';

import { init as initIndexRoutes } from './routes/index.es6';
import { init as initDB }          from './db-init.es6';
import apiRoute                    from './routes/api.es6';

function* koaLog(next) {
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  logger.log('debug', '%s %s %d - %s ms', this.method, this.url, this.status, ms);
}

function* initKoa() {
  try {
    yield initDB();
  } catch (e) {
    logger.log('error', '[SERVER] cannot initialize database', e)
  }

  return koa()
    .use(koaLog)
    .use(yield initIndexRoutes())
    .use(apiRoute)
    .use(router().allowedMethods())
    .use(serve(config.staticDir, {
      defer: true
    }));
}

const app = co(initKoa).catch(e => logger.log('error', '[SERVER]', e));

if (require.main === module) {
  app.then(a => {
    a.listen(config.appPort);
    logger.log('info', '[SERVER] running app in %s mode', a.env);
    logger.log('info', '[SERVER] listening on port %s', config.appPort);
  })
}

export default app;
