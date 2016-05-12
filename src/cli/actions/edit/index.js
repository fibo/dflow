var app = require('../../../server/app')
var createEmptyGraph = require('../../../engine/createEmptyGraph')
var fs = require('fs')
var nopt = require('nopt')
var usage = require('./usage')
var http = require('http')
var utils = require('../../utils')

var dotJson = utils.dotJson
var appendCwd = utils.appendCwd

var knownOpts = {
  help: Boolean
}

var shortHandOpts = {
  h: '--help'
}

function startServer () {
  var port = 3000

  var server = http.Server(app)

  server.listen(port)
}

module.exports = (args) => {
  var opt = nopt(knownOpts, shortHandOpts, args, 3)

  if (opt.help) {
    console.log(usage)
    process.exit(0)
  }

  var graphPath = null
  var remain = opt.argv.remain

  if (remain.length === 0) {
    graphPath = 'graph.json'
  } else {
    graphPath = remain.filter(dotJson)
                      .map(appendCwd)
                      .shift()
  }

  fs.stat(graphPath, (err, stats) => {
    if (err && err.code === 'ENOENT') {
      createEmptyGraph(graphPath, () => {
        startServer()
      })
    } else {
      if (stats.isFile()) {
        startServer()
      }
    }
  })
}
