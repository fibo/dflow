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
  const WebAudio = window.AudioContext || window.webkitAudioContext
  return new WebAudio()
}

exports.innerHTML = function (node, content) {
  node.innerHTML = content

  return node
}
