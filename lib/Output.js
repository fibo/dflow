
var Slot = require('./Slot.js')
var util = require('util')

function Output () {
  var self = this

  var arg = arguments[0] || {}

  Slot.call(self, arg)

  var _init = arg.init || true

  function isON () { return _init }
  self.isON = isON

  function isOFF () { return ! _init }
  self.isOFF = isOFF

  function reset () { _init = false }
  self.reset = reset

  var _targets = arg.targets || []
  function getTargets () { return _targets }
  self.getTargets = getTargets

  function connectTo (target) {
    // TODO controllo sul tipo, vedi se funziona
    //try {
      _targets.push(target)
    //}

    target.setSource(self)
// TODO self.emit('connectTo')
  }
  self.connectTo = connectTo

  function outputToJSON () {
    var json = self.slotToJSON()
    json.targetIds = []
    for (var i in _targerts) json.targetIds.push(_targets[i].getId())
    return json
  }
  self.outputToJSON = outputToJSON
  self.toJSON       = outputToJSON
}

util.inherits(Output, Slot)

module.exports = Output

