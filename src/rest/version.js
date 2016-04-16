var version = require('../../package.json').version

function getVersion (req, res) {
  res.end(version)
}

module.exports = getVersion
