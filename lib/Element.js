
var EventEmitter = require('events').EventEmitter

var util = require('util')

var dflow = require('./Global.js')

function Element() {
  var self = this

  var _id = dflow.addElement(self)

  function getId() { return _id }

  self.getId = getId

  function elementToJSON() { return {id: _id} }
  self.elementToJSON = elementToJSON
  self.toJSON        = elementToJSON
}

util.inherits(Element, EventEmitter)

module.exports = Element

