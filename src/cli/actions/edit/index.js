var createEmptyGraph = require('../../../engine/createEmptyGraph')
var fs = require('fs')
var nopt = require('nopt')
var usage = require('./usage')
var server = require('../../../editor/server')
var utils = require('../../utils')

var dotJson = utils.dotJson
var appendCwd = utils.appendCwd

var knownOpts = {
  help: Boolean
}

var shortHandOpts = {
  h: '--help',
  o: '--open'
}

const showUsage = () => {
  console.log(usage)
  process.exit(0)
}

module.exports = (args) => {
  var opt = nopt(knownOpts, shortHandOpts, args, 3)

  if (opt.help) showUsage()

  var open = opt.open

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
        server.start({
          graphPath,
          open
        })
      })
    } else {
      if (stats.isFile()) {
        server.start({
          graphPath,
          open
        })
      } else {
        showUsage()
      }
    }
  })
}
