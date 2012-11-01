
var util = require('util');

var Element = require('./Element.js');
var Node = require('./Node.js');

function Graph(arg) {
  var self = this;

  Element.call(self, arg);

  var _arg = arg || {};

  var _nodes = _arg.nodes || [];
  self.getNodes = function () { return _nodes; }

  self.addNode = function (arg) {
    var node = new Node(arg);

    _nodes.push(node);

    return node;
  }

  self.delNode = function (id) {
  }
}

util.inherits(Graph, Element);

Graph.prototype.toJSON = function () {
  var json = {};

  json.id = this.getId();

  json.nodes  = [];
  var nodes = this.getNodes();
  for (var i in nodes) {
    json.nodes.push(nodes[i].toJSON());
  }

  return json;
}

module.exports = Graph;

