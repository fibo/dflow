
var _    = require('underscore')
  , iper  = require('iper')
  , inherits = require('inherits')

var DflowPin = require('./DflowPin')

function DflowOutput(task, prop) {
  var meta = {}

  DflowPin.call(this, task, prop, meta)
}

inherits(DflowOutput, DflowPin)

module.exports = DflowOutput

