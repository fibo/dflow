
var _    = require('underscore')
  , iper  = require('iper')
  , util  = require('util')

var IperNode = iper.IperNode

function DflowOutput(task, arg) {
  var data = {}

  if (arguments.length !== 2)
    throw Error()

  if (! (task instanceof IperNode))
    throw new Error()

  if (_.isString(arg))
    data.name = arg

   // TODO DflowPin < DflowOutput

  IperNode.call(this, task.graph, data)

  // name
  function getName() { return data.name }

  Object.defineProperty(this, 'name', {get: getName})
}

util.inherits(DflowOutput, IperNode)

module.exports = DflowOutput

