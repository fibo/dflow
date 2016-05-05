var budo = require('budo')
var createEmptyGraph = require('../../../engine/createEmptyGraph')
var fs = require('fs')
var nopt = require('nopt')
var usage = require('./usage')
var path = require('path')
var utils = require('../../utils')

var info = require('../../../rest/info.js')
var middleware = [info]

var dotJson = utils.dotJson
var appendCwd = utils.appendCwd

var knownOpts = {
  help: Boolean
}

var shortHandOpts = {
  h: '--help'
}

function startServer () {
  console.log('startServer')
  budo(null, {
    dir: [ path.join(__dirname, '../../../editor/static') ],
    middleware: middleware,
    debug: true,
    live: true
  })
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
