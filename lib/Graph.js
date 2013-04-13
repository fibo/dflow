
var dflow = require('./Global.js')
var Node  = require('./Node.js')
var util  = require('util')

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

  function getNodeById (id) {
    for (var i in _nodes)
      if (_nodes[i].getId() === id)
        return _nodes[i]
    return
  }
  self.getNodeById = getNodeById

  function pushNode () {
    var arg = arguments[0]
      , node
    if (typeof arg === 'undefined') node = new Node()
    if (typeof arg === 'object') node = new Node(arg)
    if (arg instanceof Node) node = arg
    _nodes.push(node)
    // TODO self.emit('pushNode', node) così viene messo in globale, da un listener
    return node
  }
  self.pushNode = pushNode

  for (var i in arg.nodes) pushNode(arg.nodes[i])

  function deleteNode () {
    var arg = arguments[0]
      , node

    if (typeof arg === 'number')
      node = getNodeById(arg)

    if (arg instanceof Node)
      node = arg

    // TODO if (! node instanceof Node) errore e non fa niente

    for (var i in _nodes) {
      if (_nodes[i] === node) delete _nodes[i]
        // TODO emit delete node
    }
  }
  self.deleteNode = deleteNode

  function graphToJSON () {
    var json = self.nodeToJSON()
    json.nodes = []
    for (var i in _nodes) json.nodes.push(_nodes[i].toJSON())
    return json
  }
  self.graphToJSON = graphToJSON
  self.toJSON      = graphToJSON
}

util.inherits(Graph, Node)

module.exports = Graph

