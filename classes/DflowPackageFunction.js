
var inherits = require('inherits')

var DflowPackage = require('./DflowPackageFunction')
  , DflowTask    = require('./DflowTask')

function DflowPackageFunction () {
  DflowPackage.call(this, 'Function')
}

inherits(DflowPackageFunction, DflowPackage)

function DflowTaskApply () {
  DflowTask.apply(this, arguments)
}

inherits(DflowTaskApply, DflowTask)

DflowTaskApply.prototype.init = function applyInit () {
  this.name = 'apply'

  this.createInput({ name: 'args', data: [] })
  this.createInput({ name: 'context', data: null })
  this.createInput({ name: 'func', data: function () })

  this.createOutput({ name: 'ret' })
}

DflowTaskApply.prototype.task = function applyTask () {
  var args    = this.getInput('args').data
    , context = this.getInput('context').data
    , func    = this.getInput('func').data

  var ret = this.getOutput('ret')

  ret.data = func.apply(context, args)
}

module.exports = DflowPackageFunction

