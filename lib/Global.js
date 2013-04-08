
var pkg = require('../package.json')

//TODO info.start
exports.info = {
  version: pkg.version
}

var elements = []

// TODO rinomina in pushElement
function pushElement (element) {
  var id = elements.length
  elements.push(element)
  return id
}
exports.pushElement = pushElement

// TODO deleteElement

function getElementById(id) {
  return elements[id]
}
exports.getElementById = getElementById

