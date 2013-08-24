
var _    = require('underscore')
  , iper  = require('iper')
  , util  = require('util')

var IperNode = iper.IperNode

function DflowInput(task, arg) {
  var data = {
    name: 'in',
    value: null
  }

  if (arguments.length !== 2)
    throw Error()

  if (! (task instanceof IperNode))
    throw new Error()

  if (_.isString(arg))
    data.name = arg

   // TODO merge data and arg

  var meta = {maxDegree:1}

  IperNode.call(this, task.graph, data, meta)

  // name
  Object.defineProperty(this, 'name', {value: data.name})

  // value
  Object.defineProperty(this, 'value', {value: data.value})
}

util.inherits(DflowInput, IperNode)

module.exports = DflowInput

