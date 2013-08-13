
// Keep dflow as minimal as possible. Less is more.

var iper = require('iper')

var IperGraph = iper.IperGraph

var root = new IperGraph()

exports.root = root

exports.DflowEdge  = require('./lib/DflowEdge.js')
exports.DflowGraph = require('./lib/DflowGraph.js')
exports.DflowNode  = require('./lib/DflowNode.js')

