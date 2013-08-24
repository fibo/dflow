
var _    = require('underscore')
  , iper  = require('iper')
  , util  = require('util')

var IperNode = iper.IperNode

function DflowPin(task, prop, meta) {
  _.defaults(prop, {
    name: 'None',
    value: null
  })

  if (! (task instanceof IperNode))
    throw new TypeError()

  IperNode.call(this, task.graph, prop, meta)

  // name
  Object.defineProperty(this, 'name', {value: prop.name})

  // value
  Object.defineProperty(this, 'value', {value: prop.value})
}

util.inherits(DflowPin, IperNode)

module.exports = DflowPin

