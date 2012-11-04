
var util = require('util');

var Element = require('./Element.js');
var In      = require('./In.js');
var Out     = require('./Out.js');

function Node(arg) {
  var self = this;

  Element.call(self, arg);

  var _arg = arg || {};

  // TODO fai div e div.getStyle()
  var style = _arg.style;
  self.getStyle = function () { return style; }

  var emptyTask = function () {}

  var _task = _arg.task || emptyTask;

  var _runTask = false;
  self.runTask = function () { return _runTask; }

  _arg.ins |= [];
  var _ins = [];
  for (var i in _arg.ins) {
    var _in_ = new In(_arg.ins[i]);
    ins.push(_in_);
  }
  self.getIns = function () { return _ins; }

  _arg.outs |= [];
  var _outs = [];
  for (var o in _arg.outs) {
    var _out_ = new Out(_arg.outs[o]);
    _outs.push(_out_);
  }
  self.getOuts = function () { return _outs; }

  self.on('task', function () {
    _task(self);
    _runTask = true;
  });
}

util.inherits(Node, Element);

Node.prototype.toJSON = function () {
  var json = {};

  json.style = this.getStyle();

  json.id = this.getId();

  json.ins  = [];
  var ins = this.getIns();
  for (var i = 0; i < ins.length; i++) {
    json.ins.push(ins[i].toJSON());
  }

  json.outs = []; // TODO

  return json;
}

module.exports = Node;

