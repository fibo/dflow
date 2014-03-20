
function DflowTask () {
  this.input = {}
  this.output = {}
}

/**
 *
 */

function run () {
  throw new Error('unimplemented abstract function')
}

DflowTask.prototype.run = run

module.exports = DflowTask

