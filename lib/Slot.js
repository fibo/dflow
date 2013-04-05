
var Element = require('./Element.js')
var util    = require('util')

function Slot () {
  var self = this

  var arg = arguments[0] || {}

  Element.call(self, arg)

  var _data = arg.data
  function getData () { return _data }
  self.getData = getData

  var _type = typeof _data
  function getType () { return _type }
  self.getType = getType

  function setData (newData) {
    var canSetData = typeof _data === 'undefined' || typeof newData === _type
    if (canSetData) {
      _data = newData
      self.emit('data')
    }
  }
  self.setData = setData

  function slotToJSON () {
    var json = self.elementToJSON()
    json.data = this.getData()
    json.name = this.getName()
    return json
  }
  self.slotToJSON = slotToJSON
  self.toJSON     = slotToJSON
}

util.inherits(Slot, Element)

module.exports = Slot

