
var DflowTask = require('./DflowTask')
  , util  = require('util')

function slotTask(self) {
  self.outData = self.inData
}

function DflowSlot(graph, data) {
  var arg = {
    inputs: ['inData'],
    outputs: ['outData'],
    task: slotTask,
    data: data
  }

  DflowTask.call(this, graph, arg)
}

util.inherits(DflowSlot, DflowTask)

module.exports = DflowSlot

