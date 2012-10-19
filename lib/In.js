
var util = require('util');

var Slot = require('./Slot.js');

function In(arg) {
  var self = this;

  //Slot.call(self, arg);

  var _source;
  self.getSource = function () { return source; }

  self.setSource = function (source) {
    //TODO se newSource c'era gia', notifica la oldSource che ti sei staccato
    //si ma fai tutto ad eventi.
    _source = source;
    self.getData = _source.getData;
  }

}

//In.prototype = {};

//util.inherits(In, Slot);

module.exports = In;

