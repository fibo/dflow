
var Slot = require('./Slot.js')
var util = require('util')

function Output () {
  var self = this
    , arg = arguments[0] || {}
    , _targets = []

  Slot.call(self, arg)

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

  function setTargets () {
    var arg = arguments[0]

    if (typeof arg === 'array')
      for (var i in arg)
        connectTo(arg[i])
  }
  self.setTargets = setTargets

  function outputToJSON () {
    var json = self.slotToJSON()
    json.targetIds = []

    for (var i in _targerts)
      json.targetIds.push(_targets[i].getId())

    return json
  }
  self.outputToJSON = outputToJSON
  self.toJSON       = outputToJSON

  function init () {
    arg = arguments[0] || {}

    setTargets(arg.targets)
  }
  init(arg)
}

util.inherits(Output, Slot)

module.exports = Output

