var no = require('not-defined')

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

// Tash `.appendChild()` works but it is too dangerous!
//
// For example, inverting parent with child will delete parent.
// For instance .appendChild(element, body) will erase body.
//
// Another issue is that appending a child that has an id must
// be idempotent.
//
// It is worth to use this safe version.

exports.appendChild = function (element, child) {
  var protectedNodes = ['body', 'head']

  // Nothing to do if element or child is not provided.
  if (arguments.length < 2) return

  // Prevent erase important DOM nodes.
  protectedNodes.forEach(function (node) {
    if (child === document[node]) {
      throw new Error('cannot erase ' + node)
    }
  })

  // Check arguments look like DOM nodes.
  Array.prototype.slice.call(arguments)
       .forEach(function (node) {
         if (typeof node.appendChild !== 'function') {
           throw new Error('Cannot appendChild, not an element:' + node)
         }
       })

  // Be idempotent. It is required that child has an id.
  var id = child.id
  if (no(id)) return

  var foundChild = document.getElementById(id)
  if (foundChild) return foundChild

  // At this stage, child is a brand new element.
  return element.appendChild(child)
}

exports.body = function () { return document.body }

exports.document = function () { return document }

exports.head = function () { return document.head }

function availableTags () {
  return [
    'a', 'article', 'aside', 'button', 'form', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5',
    'input', 'label', 'li', 'link', 'ol', 'nav', 'p', 'script', 'svg',
    'textarea', 'ul'
  ]
}

exports.availableTags = availableTags

availableTags().forEach(function (x) {
  exports[x] = function (id) {
    var element

    // If id is provided, it must be a string.
    if (id && typeof id !== 'string') {
      throw new TypeError('Element id must be a string:' + id)
    }

    element = document.getElementById(id)

    if (!element) {
      element = document.createElement(x)
      element.id = id
    }

    return element
  }
})

exports.window = function () { return window }
