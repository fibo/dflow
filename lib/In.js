
var util = require('util');

var Slot = require('./Slot.js');

function In(arg) {
  var self = this;

  //Slot.call(self, arg);

  var _source;
  self.getSource = function () { return _source; }

  self.setSource = function (source) {
    //TODO se newSource c'era gia', notifica la oldSource che ti sei staccato
    //si ma fai tutto ad eventi.
    _source = source;
    self.getData = _source.getData;
  }

}

util.inherits(In, Slot);

In.prototype.toJSON = function () {
  var json = {};

  json.id = this.getId();

  return json;
}

module.exports = In;

