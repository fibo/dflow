
// TODO nei test dividi tra accessors mutators e methods
// TODO revisione sezione arguments nei test

var pkg = require('../package.json')

//TODO info.start
exports.info = {
  version: pkg.version
}

var elements = []

function pushElement (element) {
  var id = elements.length
  elements.push(element)
  return id
}
exports.pushElement = pushElement

// TODO deleteElement

// TODO listener che quando cancello o creo un nodo lo aggiunge alla lista globale.

function getElementById(id) {
  return elements[id]
}
exports.getElementById = getElementById

