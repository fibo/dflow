
var DflowTask = require('./DflowTask')
  , util  = require('util')

function emptyTask() {}

function DflowSlot(graph, value) {
  var self = this

  var prop = {
    inputs: [{name: 'in', value: value}],
    outputs: [{name: 'out'}],
    task: emptyTask
  }

  DflowTask.call(this, graph, prop)

  // override out.value accessor to return in.value
  function getOutputValue () { return self.in.value }

  Object.defineProperty(this.out, 'value', {get: getOutputValue})
}

util.inherits(DflowSlot, DflowTask)

module.exports = DflowSlot

