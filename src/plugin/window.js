
var window = global.window

module.exports = function (dflow) {
  var register = dflow.register

  register('body', function () { window.body })

  // console tasks
  var console = global.console

  for (var k in console)
    // Make sure console functions are executed in console context
    register('console.' + k, console[k], console)
}

