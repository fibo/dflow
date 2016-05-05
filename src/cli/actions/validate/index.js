var nopt = require('nopt')
var fs = require('fs')
var no = require('not-defined')
var usage = require('./usage')
var validate = require('../../../engine/validate')

var utils = require('../../utils')

var dotJson = utils.dotJson
var appendCwd = utils.appendCwd

var knownOpts = {
  funcs: String,
  help: Boolean
}

var shortHandOpts = {
  f: '--funcs',
  h: '--help'
}

module.exports = (args) => {
  var opt = nopt(knownOpts, shortHandOpts, args, 3)

  if (opt.help) {
    console.log(usage)
    process.exit(0)
  }

  var graphPath = opt.argv
                     .remain
                     .filter(dotJson)
                     .map(appendCwd)
                     .shift()

  if (no(graphPath)) {
    console.error('No path/to/graph.json provided')
    process.exit(1)
  }

  fs.stat(graphPath, (err, stats) => {
    if (err && err.code === 'ENOENT') {
      console.error(`Could not read graph file: ${graphPath}`)
      process.exit(1)
    } else {
      if (stats.isFile()) {
        var graph = require(graphPath)
        var ok = false

        if (opt.funcs) {
          var additionalFunctions = require(opt.funcs)

          ok = validate(graph, additionalFunctions)
        } else {
          ok = validate(graph, additionalFunctions)
        }

        if (ok) console.log(`ok ${graphPath}`)
      }
    }
  })
}
