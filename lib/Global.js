
var pkg = require('../package.json')

//TODO info.start
exports.info = {
  version: pkg.version
}

var elements = []

// TODO rinomina in pushElement
function addElement (element) {
  var id = elements.length
  elements.push(element)
  return id
}
exports.addElement = addElement

// TODO deleteElement

function getElementById(id) {
  return elements[id]
}
exports.getElementById = getElementById

