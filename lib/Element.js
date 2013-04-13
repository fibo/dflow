
var dflow = require('./Global.js')
var EventEmitter = require('events').EventEmitter
var util = require('util')

function Element () {
  var self = this

  var arg = arguments[0] || {}
    , _id   = dflow.pushElement(self)
    , _name

  function getId () { return _id }
  self.getId = getId

  function getName () { return _name }
  self.getName = getName

  function setName () {
    var arg = arguments[0]
      , name

    if (typeof arg === 'string')
      name = arg
    else
      return

    _name = name
  }
  self.setName = setName

  function elementToJSON () {
    var json = {}
    json.id = _id
    json.name = _name
    return json
  }
  self.elementToJSON = elementToJSON
  self.toJSON        = elementToJSON

// TODO vedi se fare la funzione init (magari anche privata) per tutti gli Element, in modo tale che
// posso fare init(arg)
  setName(arg.name)
}

util.inherits(Element, EventEmitter)

module.exports = Element

