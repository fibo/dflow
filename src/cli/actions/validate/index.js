var nopt = require('nopt')
var fs = require('fs')
var no = require('not-defined')
var path = require('path')
var usage = require('./usage')
var validate = require('../../../engine/validate')

var knownOpts = {
  funcs: String,
  help: Boolean
}
var shortHandOpts = {
  f: '--funcs',
  h: '--help'
}

var opt = nopt(knownOpts, shortHandOpts, process.argv, 3)

if (opt.help) {
  console.log(usage)
  process.exit(0)
}

module.exports = () => {
  var graphPath = opt.argv.remain
                          .map((givenPath) => path.join(process.cwd(), givenPath))
                          .shift()

  if (no(graphPath)) {
    console.error('No path provided')
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
