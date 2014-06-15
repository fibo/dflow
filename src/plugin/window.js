
function bgColor (color) {
    if (color !== document.bgColor)
      window.document.bgColor = color
}

var _window = function (dflow) {
  var register = dflow.register
    , prop

  function registerAllFrom (obj, name) {
    for (var prop in obj)
      if (typeof obj[prop] === 'function')
        register(name + '.' + prop, obj[prop], obj)
      else
        register(name + '.' + prop, obj[prop])
  }

  registerAllFrom(window.document, 'document')
  registerAllFrom(window.document.body, 'body')

  // console tasks
  for (var prop in console)
    // Make sure console functions are executed in console context
    register('console.' + prop, console[prop], console)

  register('document.bgColor', bgColor)
}

// To avoid create a `function window () {}`, name it later
_window.name = 'window'

module.exports = _window

