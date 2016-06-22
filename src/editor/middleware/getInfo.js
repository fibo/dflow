var url = require('url')
var pkg = require('../../../package.json')

var endpoint = '/info'

function handler (req, res, next) {
  if (req.method !== 'GET') {
    next()
    return
  }

  if (url.parse(req.url).pathname === endpoint) {
    res.setHeader('Content-Type', 'application/json')

    res.statusCode = 200

    res.end(JSON.stringify({
      name: pkg.name,
      version: pkg.version
    }))
  }

  next()
}

module.exports = {
  endpoint,
  handler
}
