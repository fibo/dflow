
var Node = require('./Node.js')
var util = require('util')

function Graph() {
  var self = this

  var arg = arguments[0] || {};

  var _nodes = []
  function getNodes() { return _nodes }
  self.getNodes = getNodes

  function addNode(arg) {
    // TODO if arg instanceof Node _nodes.push(arg.clone)
    var node = new Node(arg)
    _nodes.push(node)
    return node
  }
  self.addNode = addNode

  for (var i in arg.nodes) addNode(arg.nodes[i])

  function task() {
    for (var i in _nodes) _nodes[i].emit('task')
  }
  arg.task = task

  Node.call(self, arg)

  // TODO delNode
}

util.inherits(Graph, Node)

function toJSON() {
  var json = {}

  json.id = this.getId()

  json.nodes  = []
  var nodes = this.getNodes()
  for (var i in nodes) json.nodes.push(nodes[i].toJSON())

  return json
}
Graph.prototype.toJSON = toJSON

module.exports = Graph;

