
var window = global.window

module.exports = function (dflow) {
  var register = dflow.register

  register('body', function () { window.body })

}

