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

var myAudioContext = null

function audioContext () {
  if (myAudioContext) {
    return myAudioContext
  } else {
    var AudioContext = window.AudioContext || window.webkitAudioContext
    myAudioContext = new AudioContext()
    return myAudioContext
  }
}

exports.innerHTML = function (node, content) {
  node.innerHTML = content

  return node
}
