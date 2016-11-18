'use strict'

const debug = require('debug')('dflow')
const read = require('read-file-utf8')
const write = require('write-file-utf8')

var graph = null

class Graph {
  constructor (graphPath) {
    // TODO create empty graph here
    this.graphPath = graphPath
    this.graph = null
  }

  read () {
    const graphPath = this.graphPath

    debug('read graph')

    graph = read(graphPath)

    return graph
  }

  update (newGraph) {
    var graph = this.graph
    const graphPath = this.graphPath

    debug('update graph')

    graph = newGraph

    write(graphPath, graph)
  }

  CRUD () {
    const read = this.read.bind(this)
    const update = this.update.bind(this)

    return { read, update }
  }
}

module.exports = Graph
