
var _    = require('underscore')
  , iper  = require('iper')
  , util  = require('util')

var DflowPin = require('./DflowPin')

function DflowOutput(task, prop) {
  var meta = {}

  DflowPin.call(this, task, prop, meta)
}

util.inherits(DflowOutput, DflowPin)

module.exports = DflowOutput

