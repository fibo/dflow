const createEmptyGraph = require('../../../engine/createEmptyGraph')
const debug = require('debug')('dflow')
const fs = require('fs')
const nopt = require('nopt')
const server = require('../../../editor/server')
const usage = require('./usage')
const utils = require('../../utils')

var dotJson = utils.dotJson
var appendCwd = utils.appendCwd

const knownOpts = {
  help: Boolean
}

const shortHandOpts = {
  h: '--help',
  o: '--open'
}

const showUsage = () => {
  console.log(usage)
  process.exit(0)
}

module.exports = (args) => {
  const implicitEditAction = process.argv.indexOf('edit') === -1

  const opt = nopt(knownOpts, shortHandOpts, args, implicitEditAction ? 2 : 3)

  if (opt.help) showUsage()

  const open = opt.open

  var graphPath = null
  const remain = opt.argv.remain

  if (remain.length === 0) {
    graphPath = ['graph.json'].map(appendCwd)
                              .shift()
  } else {
    graphPath = remain.filter(dotJson)
                      .map(appendCwd)
                      .shift()
  }

  fs.stat(graphPath, (err, stats) => {
    if (err && err.code === 'ENOENT') {
      createEmptyGraph(graphPath, () => {
        debug(`created graph ${graphPath}`)

        server.start({
          graphPath,
          open
        })
      })
    } else {
      if (stats.isFile()) {
        debug(`found graph ${graphPath}`)

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
