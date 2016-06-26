var url = require('url')

var endpoint = '/graph'

function handler (graphPath) {
  return function (req, res, next) {
    var pathname = url.parse(req.url).pathname
    var method = req.method

    if (pathname !== endpoint) {
      next()
      return
    }

    if (method === 'GET') {
      res.setHeader('Content-Type', 'application/json')
      res.statusCode = 200
      res.end(JSON.stringify(require(graphPath)))
      return
    }

    if (method === 'PUT') {
      // TODO
      return
    }

    if (method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization')

      res.statusCode = 200

      res.end()

      return
    }

    next()
  }
}

module.exports = { endpoint, handler }
