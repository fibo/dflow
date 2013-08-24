
var DflowTask = require('./DflowTask')
  , util  = require('util')

function slotTask(self) {
  self.out.data = self.in.data
}

function DflowSlot(graph, data) {
  var arg = {
    inputs: [{name: 'in', value: data}],
    outputs: [{name: 'out', value: data}],
    task: slotTask,
    data: data
  }

  DflowTask.call(this, graph, arg)
}

util.inherits(DflowSlot, DflowTask)

module.exports = DflowSlot

