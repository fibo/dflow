var url = require('url')

var endpoint = '/graph'

function handler (req, res, next) {
  if ((req.method === 'GET') && (url.parse(req.url).pathname === endpoint)) {
    res.setHeader('Content-Type', 'application/json')

    res.statusCode = 200

    // TODO send graph from file
    res.end(JSON.stringify({
      task: {},
      pipe: {}
    }))
  } else {
    next()
  }
}

module.exports = { endpoint, handler }
