
var Node = require('./Node.js')
var util = require('util')

function Graph () {
  var self = this

  var arg = arguments[0] || {}

  function groupTask () {
    // TODO non è proprio così semplice :)
    for (var i in _nodes) _nodes[i].emit('task')
  }
  arg.task = groupTask

  Node.call(self, arg)

  var _nodes = []
  function getNodes () { return _nodes }
  self.getNodes = getNodes

  function addNode () {
    var arg = arguments[0]
    // TODO if arg instanceof Node _nodes.push(arg.clone)
    var node = new Node(arg)
    _nodes.push(node)
    return node
  }
  self.addNode = addNode

  for (var i in arg.nodes) addNode(arg.nodes[i])

  function delNode () {
    var node = arguments[0]
  // TODO delNode
  }
  self.delNode = delNode

  function graphToJSON () {
    var json = self.nodeToJSON
    json.nodes = []
    for (var i in _nodes) json.nodes.push(_nodes[i].toJSON())
    return json
  }
  self.graphToJSON = graphToJSON
  self.toJSON      = graphToJSON
}

util.inherits(Graph, Node)

module.exports = Graph

