
// TODO revisione sezione arguments nei test

var pkg = require('../package.json')
  , elements = []

//TODO info.start
exports.info = {
  version: pkg.version
}


function deleteElement (element) {
  for (var i in elements)
    if (elements[i] === element)
      delete elements[i]
}
exports.deleteElement = deleteElement

function pushElement (element) {
  var id = elements.length
  elements.push(element)
  return id
}
exports.pushElement = pushElement

// TODO deleteElement

// TODO listener che quando cancello o creo un nodo lo aggiunge alla lista globale.
// on pushElement deleteElement -> scattano le funzioni

function getElementById(id) {
  for (var i in elements)
    if (elements[i].getId() === id)
      return elements[id]

  return
}
exports.getElementById = getElementById

