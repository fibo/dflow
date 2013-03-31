
//
// Emettere un evento e chiamare una funzione sono quasi la stessa cosa.
//

var Slot = require('./Slot.js')
var util = require('util')

function Out() {
  var self = this

  var arg = arguments[0] || {}

  Slot.call(self, arg);

  var _init = arg.init || true

  function isON() { return _init }
  self.isON = isON

  function isOFF() { return ! _init }
  self.isOFF = isOFF

  function reset() { _init = false }
  self.reset = reset

  var _targets = arg.targets || []
  function getTargets() { return _targets }
  self.getTargets = getTargets

  function connectTo(target) {
    // TODO controllo sul tipo, vedi se funziona
    //try {
      _targets.push(target)
    //}

    target.setSource(self)
// TODO self.emit('connectTo')
  }
  self.connectTo = connectTo
}

util.inherits(Out, Slot)

module.exports = Out

