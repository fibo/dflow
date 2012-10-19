
//
// Emettere un evento e chiamare una funzione sono quasi la stessa cosa.
//

var util = require('util');

var Slot = require('./Slot.js');

function Out(arg) {
  var self = this;

  var _arg = arg || {};
  var _init = false;
  var _type;
  var _data;

  if (typeof _arg.data != 'undefined') {
    _data = arg.data;
    _type = typeof _data;
    _init = true;
  }

  if (typeof _arg.init == 'boolean') {
    _init = arg.init;
  }

  self.isON  = function () { return   _init; }

  self.isOFF = function () { return ! _init; }

  self.reset = function () { _init = false; }

  //Slot.call(self, arg);

  var _targets = [];
  self.getTargets = function () { return _targets; }

  self.connectTo = function (target) {
    // TODO controllo sul tipo, vedi se funziona
    //try {
      _targets.push(target);
    //}

    target.setSource(self);
  }

  self.getData = function () { return _data; }

  self.setData = function (data) {
    if (typeof data == _type) {
      _data = data;
      self.emit('data');
    }
  }
}

//Out.prototype = {};

//util.inherits(Out, Slot);

module.exports = Out;

