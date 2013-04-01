
var Slot = require('./Slot.js')
var util = require('util')

function Input() {
  var self = this

  var arg = arguments[0] || {}

  Slot.call(self, arg)

  // TODO setSource(arg.source)
  var _source = arg.source
  function getSource() { return _source }
  self.getSource = getSource

  function setSource(newSource) {
    //TODO se newSource c'era gia', notifica la oldSource che ti sei staccato
    //si ma fai tutto ad eventi.
    _source = newSource
    self.getData = _source.getData
  }
  self.setSource = setSource

  function inputToJSON() {
    var json = self.slotToJSON()
    json.sourceId = _source.getId() // TODO solo se è collegato
    return json
  }
  self.inputToJSON = inputToJSON
  self.toJSON      = inputToJSON
}

util.inherits(Input, Slot)

module.exports = Input

