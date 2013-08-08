
module.exports = function () {

var dflow = require('dflow');

var Graph = dflow.DflowGraph();

var graph = new DflowGraph();

var id1 = graph.createNode('Hello World');
var id2 = graph.createNode(function (msg) {console.log(msg);});

graph.createEdge(id1, id2);

graph.run();

};
