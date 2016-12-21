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

exports.audioContext = audioContext

exports.body = function () {
  return document.body
}

exports.document = function () {
  return document
}

exports.head = function () {
  return document.head
}

exports.innerHTML = function (node, content) {
  node.innerHTML = content

  return node
}

exports.window = function () {
  return window
}
