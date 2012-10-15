
var Node = require('./lib/Node.js');
exports.Node = Node;

var Edge = require('./lib/Edge.js');
exports.Edge = Edge;

var In = require('./lib/In.js');
exports.In = In;

var Out = require('./lib/Out.js');
exports.Out = Out;

var Graph = require('./lib/Graph.js');
exports.Graph = Graph;

var Slot = require('./lib/Slot.js');
exports.Slot = Slot;

//Create a global dflow graph, a.k.a root.
var dflow = {};
dflow.root = new Graph();
process.dflow = dflow;

