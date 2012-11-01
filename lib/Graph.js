
var util = require('util');

var Element = require('./Element.js');
var Node = require('./Node.js');

function Graph(arg) {
  var self = this;

  var _arg = arg || {};

  var _nodes = _arg.nodes || [];
  self.getNodes = function () { return _nodes; }

  self.addNode = function (arg) {
    arg.graph = self;

    var node = new Node(arg);
    _nodes.push(node);

    return node;
  }

  self.delNode = function (id) {
  }
}

util.inherits(Graph, Element);

Node.prototype.toJSON = function () {
  var json = {};

  json.id = this.getId();

  //json.ins  = []; // TODO
  //var ins = this.getIns();
  //for (var i in ins) {
    //json.ins.push(ins[i].toJSON());
  //}
  //json.outs = []; // TODO

  return json;
}

module.exports = Graph;

