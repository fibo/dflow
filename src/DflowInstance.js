
var dflow = require('./index')
  , iper  = require('iper')

var DflowOperationContainer = dflow.DflowOperationContainer
  , IperGraph               = iper.IperGraph

function DflowInstance () {
  // model graph
  var graph = new IperGraph()

  Object.defineProperty(this, 'graph', {value: graph})

  // operation tree
  var root = new DflowOperationContainer()

  Object.defineProperty(this, 'root', {value: root})
}

module.exports = DflowInstance

