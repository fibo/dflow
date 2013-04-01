
// Keep dflow as minimal as possible. Less is more.

var Element = require('./lib/Element.js')
exports.Element = Element

var Node = require('./lib/Node.js')
exports.Node = Node

var Graph = require('./lib/Graph.js')
exports.Graph = Graph

var Input = require('./lib/Input.js')
exports.Input = Input

var Output = require('./lib/Output.js')
exports.Output = Output

var Slot = require('./lib/Slot.js')
exports.Slot = Slot

var dflow = require('./lib/Global.js')

// Create a global dflow graph, a.k.a. root.
dflow.root = new Graph()

// TODO process.window
process.dflow = dflow

