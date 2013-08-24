
var _    = require('underscore')
  , iper  = require('iper')
  , util  = require('util')

var DflowPin = require('./DflowPin')

function DflowInput(task, prop) {
  var meta = {maxDegree:1}

  DflowPin.call(this, task, prop, meta)
}

util.inherits(DflowInput, DflowPin)

module.exports = DflowInput

