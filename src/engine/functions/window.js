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

// .appendChild() works but it is too dangerous
// it is worth to use this safe version
exports.appendChild = function (element, child) {
  console.log(element, child)
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

    if (typeof id !== 'string') {
      throw new TypeError('Element id must be a string:' + id)
    }

    element = document.getElementById(id)

    if (!element) {
      element = document.createElement(x)

      Object.defineProperty(element, 'id', {
        configurable: false,
        writable: false,
        value: id
      })
    }

    return element
  }
})

exports.window = function () { return window }
