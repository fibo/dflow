
var _    = require('underscore')
  , iper  = require('iper')
  , util  = require('util')

var IperNode = iper.IperNode

function DflowPin(task, prop, meta) {
  var self = this

  if (! (task instanceof IperNode))
    throw new TypeError()

  _.defaults(prop, {
    name: 'None',
    value: null
  })

  IperNode.call(this, task.graph, prop, meta)

  function getValue() { return prop.value }

  function setValue(newValue) { prop.value = newValue }

  // name
  Object.defineProperty(this, 'name', {value: prop.name})

  // value
  // configurable is set to true to allow ovveriding get and set descriptors
  Object.defineProperty(this, 'value', {
    get: getValue,
    set: setValue,
    configurable: true
  })

  // isEmpty
  function getIsEmpty() { return self.value === null }

  Object.defineProperty(this, 'isEmpty', {get: getIsEmpty})
}

util.inherits(DflowPin, IperNode)

module.exports = DflowPin

