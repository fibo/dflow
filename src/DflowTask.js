
function DflowTask () {
  this.name = 'Task'
}

/*
 *
 */

function getInputs () {
  var inputs = []
  // for each this.keys
  //
  // inputs.push if instanceof DflowInput
  //

  return inputs
}

DflowTask.prototype.getInputs = getInputs

function run () {
  throw new Error('unimplemented abstract function')
}

DflowTask.prototype.run = run

module.exports = DflowTask

