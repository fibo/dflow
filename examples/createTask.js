
var dflow    = require('dflow')
  , inherits = require('inherits')

var DflowInput  = dflow.DflowInput
  , DflowOutput = dflow.DflowOutput
  , DflowTask   = dflow.DflowTask

function Foo () {
  DflowTask.apply(this, arguments)

  this.input1 = new DflowInput()

  this.output1 = new DflowOutput()
}

inherits(Foo, DflowTask)

function run () {
  this.output1 = this.input1
}

module.exports = Foo

