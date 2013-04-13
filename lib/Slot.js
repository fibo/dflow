
var Element = require('./Element.js')
var util    = require('util')

function Slot () {
  var self = this
    , arg = arguments[0] || {}
    , _data

  Element.call(self, arg)

  function getData () { return _data }
  self.getData = getData

  function getType () { return typeof _data }
  self.getType = getType

  function setData (data) {
    var data = arguments[0]
      , canSetData = false

    if (typeof data === 'undefined')
      return

    canSetData = (getType() === 'undefined' || getType() === typeof data)

    if (canSetData) {
      _data = data
      self.emit('data')
    }
  }
  self.setData = setData

  function slotToJSON () {
    var json = self.elementToJSON()
    json.data = _data
    return json
  }
  self.slotToJSON = slotToJSON
  self.toJSON     = slotToJSON

  function init () {
    arg = arguments[0] || {}

    setData(arg.data)
  }
  init(arg)
}

util.inherits(Slot, Element)

module.exports = Slot

