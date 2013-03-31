
var Element = require('./Element.js')
var util = require('util')

// TODO new Slot('name',data)

function Slot() {
  var self = this

  var arg = arguments[0]

  var _data = arg.data
  function getData() { return _data }
  self.getData = getData

  var _name = arg.name;
  function getName() { return _name }
  self.getData = getData

  var _type = typeof _data;
  function getType() { return _type }

  function setData(newData) {
    if (typeof newData === _type) {
      _data = newData
      self.emit('data')
    }
  }
  self.setData = setData

// TODO function data che è sia getter che setter a seconda degli arguments
//      e così tolgo getData e setData
}

util.inherits(Slot, Element)

module.exports = Slot

