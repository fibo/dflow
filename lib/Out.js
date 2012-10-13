
var Slot = require('./Slot.js');

function Out(arg) {
  var self = this;

  Slot.call(self, arg);

  var targets = [];
  self.getTargets = function () { return []; }

  self.connectTo = function (target) {
    // TODO controllo sul tipo, vedi se funziona
    try {
      target.setData(self.getData());
      targets.push(target);
    }

    target.setSource(self);
  }

}

Out.prototype = {};

module.exports = Out;

