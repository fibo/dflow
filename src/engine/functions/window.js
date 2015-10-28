
exports.document = function () {
  return document
}

exports.body = function () {
  return document.body
}

exports.head = function () {
  return document.head
}

exports.window = function () {
  return window
}

exports.AudioContext = function () {
  return window.AudioContext || window.webkitAudioContext
}

exports.getElementById = function (id) {
  return window.document.getElementById(id)
}

exports.createElement = function (el) {
  return window.document.createElement(el)
}

exports.innerHTML = function (node, content) {
  node.innerHTML = content

  return node
}

