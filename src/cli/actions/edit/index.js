const debug = require('debug')('dflow')
const fs = require('fs')
const http = require('http')
const internalIp = require('internal-ip')
const nopt = require('nopt')
const opn = require('opn')

const createEmptyGraph = require('../../../engine/createEmptyGraph')
const editorServer = require('../../../editor/server')
const Graph = require('../../../engine/Graph')
const usage = require('./usage')
const utils = require('../../utils')

const dotJson = utils.dotJson
const appendCwd = utils.appendCwd

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

const startServer = (graphPath, open) => {
  const graph = new Graph(graphPath)

  const server = http.createServer(editorServer(graph.CRUD()))

  server.listen(() => {
    const port = server.address().port
    const myIp = internalIp()
    const uri = `http://${myIp}:${port}`

    debug(server.address().port)
    debug(`editor server is listening on ${uri}`)

    if (open) opn(uri)
  })
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

        startServer(graphPath, open)
      })
    } else {
      if (stats.isFile()) {
        debug(`found graph ${graphPath}`)

        startServer(graphPath, open)
      } else {
        showUsage()
      }
    }
  })
}
