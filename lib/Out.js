
function Out(arg) {
  var self = this;

  Slot.call(self, arg);

  var targets = [];
  self.getTargets = function () { return []; }

  self.connectTo = function (target) {
    targets.push(target);
  }

}

Out.prototype = {};

module.exports = Out;

