
var EventEmitter = require('events').EventEmitter

var util = require('util')

var dflow = require('./Global.js')

function Element() {
  var self = this

  var arg = arguments[0] || {}

  var _id = dflow.addElement(self)
  function getId() { return _id }
  self.getId = getId

  var _name = arg.name
  function getName() { return _name }
  self.getName = getName

  function elementToJSON() {
    var json = {}
    json.id = _id
    json.name = _name
    return json
  }
  self.elementToJSON = elementToJSON
  self.toJSON        = elementToJSON
}

util.inherits(Element, EventEmitter)

module.exports = Element

