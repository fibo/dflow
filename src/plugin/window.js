
var window = global.window     || {}
  , document = window.document || {}
  , body     = document.body   || {}

function bgColor (color) {
    if (color !== document.bgColor)
      document.bgColor = color
}

module.exports = function (dflow) {
  var register = dflow.register

  register('body', function () { return body })

  // console tasks
  var console = global.console

  for (var k in console)
    // Make sure console functions are executed in console context
    register('console.' + k, console[k], console)

  register('bgColor', bgColor)
}

