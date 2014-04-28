
function DflowTask () {
  this.name = 'Task'
}

/**
 * Abstract function
 */
function run () {
  throw new Error('unimplemented abstract function')
}

DflowTask.prototype.run = run

module.exports = DflowTask

