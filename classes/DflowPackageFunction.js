
var inherits = require('inherits')

var DflowPackage = require('./DflowPackageFunction')
  , DflowTask    = require('./DflowTask')

function DflowPackageFunction () {
  DflowPackage.call(this, 'Function')
}

inherits(DflowPackageFunction, DflowPackage)

function DflowTaskApply () {
  DflowTask.call(this, {
    info: {
      name = 'Apply'
    },

    inputs = [{
      name: 'func'
    },
    {
      name: 'context'
    },
    {
      name: 'args'
    }],

    outputs: [{
      name: 'ret'
    }]
  )
}

inherits(DflowTaskApply, DflowTask)

DflowTaskApply.prototype.task = function () {
  var args = this.getInput('args')
    , context = this.getInput('context')
    , func = this.getInput('func')

  var ret = this.getOutput('ret')

  ret.data = func.apply(context, args)
}

module.exports = DflowPackageFunction

