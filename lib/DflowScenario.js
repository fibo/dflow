
var util  = require('util')

var DflowModule = require('./DflowModule')

function DflowScenario() {

  this.modules = {}
  this.edges = {}
  this.task = function () {/* TODO run tasj for every module */}
}

util.inherits(DflowScenario, DflowModule)

module.exports = DflowScenario

