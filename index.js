
var Element = require('./lib/Element.js');
exports.Element = Element;

var Node = require('./lib/Node.js');
exports.Node = Node;

var In = require('./lib/In.js');
exports.In = In;

var Out = require('./lib/Out.js');
exports.Out = Out;

var Graph = require('./lib/Graph.js');
exports.Graph = Graph;

var Slot = require('./lib/Slot.js');
exports.Slot = Slot;

var dflow = require('./lib/Global.js');

//Create a global dflow graph, a.k.a root.
dflow.root = new Graph();

process.dflow = dflow;

