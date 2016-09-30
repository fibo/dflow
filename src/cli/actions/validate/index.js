const nopt = require('nopt')
const fs = require('fs')
const no = require('not-defined')
const usage = require('./usage')
const validate = require('../../../engine/validate')

const utils = require('../../utils')

const dotJson = utils.dotJson
const appendCwd = utils.appendCwd

const knownOpts = {
  funcs: String,
  help: Boolean
}

const shortHandOpts = {
  f: '--funcs',
  h: '--help'
}

module.exports = (args) => {
  const opt = nopt(knownOpts, shortHandOpts, args, 3)

  if (opt.help) {
    console.log(usage)
    process.exit(0)
  }

  const graphPath = opt.argv
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
          const additionalFunctions = require(opt.funcs)

          ok = validate(graph, additionalFunctions)
        } else {
          ok = validate(graph)
        }

        if (ok) console.log(`ok ${graphPath}`)
      }
    }
  })
}
