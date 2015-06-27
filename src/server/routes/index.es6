import Router from 'koa-router';
import React  from 'react';
import Rx     from 'rx';
import moment from 'moment';
import uuid   from 'node-uuid';
import changeCase from 'change-case';

import db     from '../../shared/database.es6';
import config from '../config.es6';
import logger from '../../shared/logger.es6';
import body   from '../../jsx/body.jsx';

const router = Router();
const Body = React.createFactory(body);

/**
 * Initialize the index route for all navigation routes.
 *
 * @returns {Object} Koa router routes.
 */
export function* init() {
  const routes = yield db.get('routes');

  // Set content response for all navigable route paths.
  for (let route of routes.content) {
    logger.log('debug', '[INDEX] init route "%s" -> %s', route.name, route.path);
    router.get(route.path, contentResponse(routes.content));
  }

  return router.routes();
}

/**
 * Create a generator function for the index route.
 *
 * @param {Array} navRoutes Collection of all navigation routes.
 * @returns {Function} Generator function for the index route.
 */
function contentResponse(navRoutes) {
  return function*() {

    const currentRoute = yield Rx.Observable
      .fromArray(navRoutes)
      .filter(route => route.path === this.path)
      .first()
      .toPromise();

    let currentContent;

    // Request the content for the current route.
    try {
      currentContent = yield db.get(changeCase.param(currentRoute.name));
    } catch (e) {
      logger.log('error', '[INDEX] database error on key "%s" (%d)', currentRoute.name, e.status);
      yield Promise.reject(e);
    }

    // Create the initial application state.
    const state = Object.freeze({
      route : currentRoute,
      dbName: config.dbName,
      dbPublicAddress: config.dbPublicAddress,
    });

    const props = Object.freeze({
      styles         : config.stylesheets,
      scripts        : config.allScripts(),
      navRoutes      : navRoutes,
      initialIndex   : currentRoute.index,
      initialContent : currentContent.content,
      stateCookieName: uuid.v4()
    });

    // Set a temporary cookie that contains the initial application state.
    this.cookies.set(props.stateCookieName, JSON.stringify(state), {
      httpOnly: false,
      expires : moment().add(5, 'second').toDate()
    });

    this.body = yield new Promise(resolve => resolve(React.renderToStaticMarkup(Body(props))));
  };
}
