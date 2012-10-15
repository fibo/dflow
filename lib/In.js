
var util = require('util');

var Slot = require('./Slot.js');

function In(arg) {
  var self = this;

  Slot.call(self, arg);

  var source;
  self.getSource = function () { return source; }

  self.setSource = function (newSource) {
    //TODO se newSource c'era gia', notifica la oldSource che ti sei staccato
    //si ma fai tutto ad eventi.
    self.setData(newSource.getData());
    source = newSource;
  }

}

In.prototype = {};

util.inherits(In, Slot);

module.exports = In;

