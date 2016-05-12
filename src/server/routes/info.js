var pkg = require('../../../package.json')

function info (req, res) {
  res.json({
    name: pkg.name,
    version: pkg.version
  })
}

module.exports = info
