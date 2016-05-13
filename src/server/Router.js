'use strict'

class Router {
  constructor () {
    this.routes = require('./routes')
  }

  /**
   * Attach routes to an express app.
   *
   * @param {Object} app, i.e. an express app
   */

  registerRoutesOn (app) {
    var routes = this.routes

    function addHttpRequest (method) {
      function addRoute (path) {
        var middlewares = routes[method][path]

        app[method].bind(app, path).call(app, middlewares)
      }

      Object.keys(routes[method])
            .forEach(addRoute)
    }

    Object.keys(routes)
          .forEach(addHttpRequest)
  }
}
