
var dflow = require('./Global.js')
  , Node  = require('./Node.js')
  , util  = require('util')

function Graph () {
  var self = this
    , arg = arguments[0] || {}
    , _nodes = []
    , _graphs = []

  function groupTask () {
    // TODO non è proprio così semplice :)
    // TODO considera se il task del graph è definito qua
    // oppure se non viene impostato dal Global e quindi potrebbe essere diverso
    // di default sarebbe quindi il task vuoto
    // infatti potrei settarlo dopo con il setTask
    for (var i in _nodes) _nodes[i].emit('task')
  }
  arg.task = groupTask

  Node.call(self, arg)

  function getGraphs () { return _graphs }
  self.getGraphs = getGraphs

  function getGraphById (id) {
    for (var i in _graphs)
      if (_graphs[i].getId() === id)
        return _graphs[i]

    return
  }
  self.getGraphById = getGraphById

  function getNodes () { return _nodes }
  self.getNodes = getNodes

  function getNodeById (id) {
    for (var i in _nodes)
      if (_nodes[i].getId() === id)
        return _nodes[i]

    return
  }
  self.getNodeById = getNodeById

  function pushGraph () {
    var arg = arguments[0]
      , graph

    if (typeof arg === 'undefined')
      graph = new Graph()

    if (typeof arg === 'object')
      graph = new Graph(arg)

    if (arg instanceof Graph)
      graph = arg

    _graphs.push(graph)

    return graph
  }
  self.pushGraph = pushGraph

  function pushNode () {
    var arg = arguments[0]
      , node

    if (typeof arg === 'undefined')
      node = new Node()

    if (typeof arg === 'object')
      node = new Node(arg)

    if (arg instanceof Node)
      node = arg

    _nodes.push(node)
    // TODO self.emit('pushNode', node) così viene messo in globale, da un listener
    // deve essere fatto però da tutti i push e delete, vedi anche Node
    return node
  }
  self.pushNode = pushNode

  function deleteGraph () {
    var arg = arguments[0]
      , graph

    if (typeof arg === 'number')
      graph = getGraphById(arg)

    if (arg instanceof Graph)
      graph = arg

    for (var i in _graphs)
      if (_graphs[i] === graph)
        delete _graphs[i]
  }
  self.deleteGraph = deleteGraph

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

    for (var i in _nodes)
      json.nodes.push(_nodes[i].toJSON())

    return json
  }
  self.graphToJSON = graphToJSON
  self.toJSON      = graphToJSON

  function init () {
    arg = arguments[0] || {}

    for (var i in arg.graphs)
      pushGraph(arg.graphs[i])
   
    for (var i in arg.nodes)
      pushNode(arg.nodes[i])
  }
  init(arg)
}

util.inherits(Graph, Node)

module.exports = Graph

