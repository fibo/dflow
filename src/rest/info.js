var pkg = require('../../package.json')

function info (req, res) {
  res.setHeader('Content-Type', 'application/json')

  res.end(JSON.stringify({
    name: pkg.name,
    version: pkg.version
  }))
}

module.exports = info
