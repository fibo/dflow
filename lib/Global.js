
var pkg = require('../package.json')

//TODO info.start
exports.info = {
  version: pkg.version
}

var elements = []

function addElement(element) {
  var id = elements.length

  elements.push(element)

  return id
}

exports.addElement = addElement


function getElementById(id) {
  return elements[id]
}

exports.getElementById = getElementById

