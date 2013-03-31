
var Slot = require('./Slot.js')
var util = require('util')

function In() {
  var self = this

  var arg = arguments[0] || {}

  Slot.call(self, arg)

  var _source = arg.source
  function getSource() { return _source }
  self.getSource = getSource

  function setSource(newSource) {
    //TODO se newSource c'era gia', notifica la oldSource che ti sei staccato
    //si ma fai tutto ad eventi.
    _source = source
    self.getData = _source.getData
  }
  self.setSource = setSource
}

util.inherits(In, Slot)

function toJSON() {
  var json = {}
// TODO source
  json.id = this.getId()
  return json
}
In.prototype.toJSON = toJSON

module.exports = In

