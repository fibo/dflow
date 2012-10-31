
var util = require('util');

var Element = require('./Element.js');
var In      = require('./In.js');
var Out     = require('./Out.js');

function Node(arg) {
  var self = this;

  Element.call(self, arg);

  if (typeof arg != "object") {
    arg = {};
  }

  if (typeof arg.task != "function") {
    throw new Error();
    //TODO vedi se va bene mettere qua il return al posto dell if else
    //return  false;
  }
  else {

    var task = arg.task;

    try {
      task(self);
    }
    catch(err) {}
    finally {
      self.on('task',function(){task(self)});
    
      arg.ins |= [];
      var ins = [];
      for (var i in arg.ins) {
        var _in = new In(arg.ins[i]);
        ins.push(_in);
      }
      self.getIns = function () { return ins; }
    
      arg.outs |= [];
      var outs = [];
      for (var o in arg.outs) {
        var _out = new Out(arg.outs[o]);
        outs.push(_out);
      }
      self.getOuts = function () { return outs; }
    }
  }
}

util.inherits(Node, Element);

Node.prototype.toJSON = function () {
  var json = {};

  json.id = this.getId();

  return json;
}

module.exports = Node;

