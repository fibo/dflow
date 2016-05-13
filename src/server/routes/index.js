var info = require('./info')

var routes = {
  GET: {},
  POST: {},
  PUT: {},
  DELETE: {}
}

routes.GET['/info'] = [info]

module.exports = routes
