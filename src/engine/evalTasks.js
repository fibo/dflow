var isDflowDSL = require('./isDflowDSL')
var reservedTaskNames = require('./reservedTaskNames')

function alreadyDefined (funcs, task) {
  return function (taskKey) {
    var taskName = task[taskKey]
    return !(taskName in funcs)
  }
}

function dflowDSL (task) {
  return function (taskKey) {
    var taskName = task[taskKey]
    return !isDflowDSL(taskName)
  }
}

function reserved (task) {
  return function (taskKey) {
    var taskName = task[taskKey]
    return reservedTaskNames.indexOf(taskName) === -1
  }
}

/**
 * Inject evaluated tasks to functions.
 *
 * @param {Object} funcs reference
 * @param {Object} task
 */

function evalTasks (funcs, task) {
  /**
  * Evaluate a single task and inject it.
  *
  * @param {String} taskKey
  */

  function inject (taskKey) {
    var taskName = task[taskKey]

    try {
      var e = eval(taskName) // eslint-disable-line

      if (typeof e === 'function') {
        funcs[taskName] = e
      } else {
        funcs[taskName] = function () { return e }
      }
    } catch (err) {
      var msg = 'Task not compiled: ' + taskName + ' [' + taskKey + ']' + err
      throw new Error(msg)
    }
  }

  Object.keys(task)
    .filter(reserved(task))
    .filter(dflowDSL(task))
    .filter(alreadyDefined(funcs, task))
    .forEach(inject)
}

module.exports = evalTasks
