
var Element = require('./Element.js')
  , Input   = require('./Input.js')
  , Output  = require('./Output.js')
  , util    = require('util')

function Node () {
  var self = this
    , arg = arguments[0] || {}
    , _hasRunTask = false
    , _inputs     = []
    , _outputs    = []
    , _task       = function emptyTask () {}

  Element.call(self, arg)

  function setTask () {
    var arg = arguments[0]

    if (typeof arg === 'function')
      _task = arg
    // TODO emit changeTask
  }
  self.setTask = setTask

  function hasRunTask () { return _hasRunTask }
  self.hasRunTask = hasRunTask

  function getInputById (id) {
    for (var i in _inputs)
      if (_inputs[i].getId() === id)
        return _inputs[i]

    return
  }
  self.getInputById = getInputById

  function getInputs () { return _inputs }
  self.getInputs = getInputs

  function getOutputById (id) {
    for (var i in _outputs)
      if (_outputs[i].getId() === id)
        return _outputs[i]

    return
  }
  self.getOutputById = getOutputById

  function getOutputs () { return _outputs }
  self.getOutputs = getOutputs

  function deleteInput () {
    var arg = arguments[0]
      , output

    if (typeof arg === 'number')
      output = getInputById(arg)

    if (arg instanceof Input)
      output = arg

    for (var i in _outputs)
      if (_outputs[i] === output)
        delete _outputs[i]
  }
  self.deleteInput = deleteInput

  function pushInput () {
    var arg = arguments[0]
      , input

    if (typeof arg === 'undefined')
      input = new Input()

    if (typeof arg === 'object')
      input = new Input(arg)

    if (arg instanceof Input)
      input = arg

    _inputs.push(input)

    return input
  }
  self.pushInput = pushInput

  function deleteOutput () {
    var arg = arguments[0]
      , output

    if (typeof arg === 'number')
      output = getOutputById(arg)

    if (arg instanceof Output)
      output = arg

    for (var i in _outputs)
      if (_outputs[i] === output)
        delete _outputs[i]
  }
  self.deleteOutput = deleteOutput

  function pushOutput () {
    var arg = arguments[0]
      , output

    if (typeof arg === 'undefined')
      output = new Output()

    if (typeof arg === 'object')
      output = new Output(arg)

    if (arg instanceof Output)
      output = arg

    _outputs.push(output)

    return output
  }
  self.pushOutput = pushOutput

  function onTask () {
    _task(self)
    _hasRunTask = true
  }
  self.on('task', onTask)

  function nodeToJSON () {
    var json = self.elementToJSON()
    json.inputs = []
    for (var i in _inputs) json.inputs.push(_inputs[i].toJSON())
    json.outputs = []
    for (var i in _outputs) json.inputs.push(_outputs[i].toJSON())
    return json
  }
  self.nodeToJSON = nodeToJSON
  self.toJSON     = nodeToJSON

  function init () {
    arg = arguments[0] || {}

    for (var i in arg.inputs)
      pushInput(arg.inputs[i])
   
    for (var i in arg.outputs)
      pushOutput(arg.outputs[i])
   
    setTask(arg.task)
  }
  init(arg)
}

util.inherits(Node, Element)

module.exports = Node

