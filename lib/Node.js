
var Element = require('./Element.js')
var Input   = require('./Input.js')
var Output  = require('./Output.js')
var util    = require('util')

function emptyTask () {}

function Node () {
  var self = this

  var arg = arguments[0] || {}

  Element.call(self, arg)

  var _task = arg.task || emptyTask

  var _hasRunTask = false
  function hasRunTask () { return _hasRunTask }
  self.hasRunTask = hasRunTask

  var _inputs = []
  for (var i in arg.inputs) {
    var input = new Input(arg.inputs[i])
    _inputs.push(input)
  }
  function getInputs () { return _inputs }
  self.getInputs = getInputs

  var _outputs = []
  for (var i in arg.outputs) {
    var output = new Output(arg.outputs[i])
    _outputs.push(output)
  }
  function getOutputs () { return _outputs }
  self.getOutputs = getOutputs

  function onTask () {
    _task(self)
    _hasRunTask = true
  }
  self.on('task', onTask)

  function nodeToJSON () {
    var json = self.elementToJSON
    json.inputs = []
    for (var i in _inputs) json.inputs.push(_inputs[i].toJSON())
    json.outputs = []
    for (var i in _outputs) json.inputs.push(_outputs[i].toJSON())
  }
  self.nodeToJSON = nodeToJSON
  self.toJSON     = nodeToJSON
}

util.inherits(Node, Element)

module.exports = Node

