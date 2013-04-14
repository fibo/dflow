
var Output = require('./Output.js')
  , Slot   = require('./Slot.js')
  , util   = require('util')

function Input () {
  var self = this
    , arg = arguments[0] || {}
    , _source

  Slot.call(self, arg)

  function getSource () { return _source }
  self.getSource = getSource

  function setSource (newSource) {
// TODO questo mutator non è conforme agli altri
// inoltre sarebbe forse da chiamare connectTo ?
    if (newSource instanceof Output) {
      _source = newSource
      self.getData = _source.getData
      self.emit('source')
    }
    else {
      // TODO aggiustare eccezioni
      new TypeError()
    }
    //TODO se newSource c'era gia', notifica la oldSource che ti sei staccato
    //si ma fai tutto ad eventi.
  }
  self.setSource = setSource

  function isConnected () {
    return _source instanceof Output
  }
  self.isConnected = isConnected

  function inputToJSON () {
    var json = self.slotToJSON()

    json.sourceId = _source.getId() // TODO solo se è collegato

    return json
  }
  self.inputToJSON = inputToJSON
  self.toJSON      = inputToJSON

  function init () {
    arg = arguments[0] || {}

    setSource(arg.source)
  }
  init(arg)
}

util.inherits(Input, Slot)

module.exports = Input

