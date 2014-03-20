
var dflow    = require('dflow')
  , inherits = require('inherits')

var DflowInput  = dflow.DflowInput
  , DflowOutput = dflow.DflowOutput
  , DflowTask   = dflow.DflowTask

function Foo () {
  DflowTask.apply(this, arguments)

  this['in'] = new DflowInput({data: 1})

  this['out'] = new DflowOutput()
}

inherits(Foo, DflowTask)

function run () {
  this.output['out'].data = this.input['in'].data
}

module.exports = Foo


