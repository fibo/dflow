
var Element = require('./Element.js')
var util    = require('util')

// TODO new Slot('name',data)

function Slot() {
  var self = this

  var arg = arguments[0] || {}

  Element.call(self, arg)

  var _data = arg.data
  function getData() { return _data }
  self.getData = getData

  var _name = arg.name
  function getName() { return _name }
  self.getName = getName

  var _type = typeof _data
  function getType() { return _type }

  function setData(newData) {
// TODO caso speciale _data undefined
    if (typeof newData === _type) {
      _data = newData
      self.emit('data')
    }
  }
  self.setData = setData

// TODO function data che è sia getter che setter a seconda degli arguments
//function data() {
//if (arguments.length === 0) return self.getData()
//}

  function slotToJSON() {
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

