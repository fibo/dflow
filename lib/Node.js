
var Element = require('./Element.js')
var In      = require('./In.js')
var Out     = require('./Out.js')
var util    = require('util')

function emptyTask() {}

function Node(arg) {
  var self = this

  Element.call(self, arg)

  var arg = arguments[0] || {}

  var _task = arg.task || emptyTask

  var _hasRunTask = false
  function hasRunTask() { return _runTask }
  self.hasRunTask = hasRunTask

  var _ins = []
  for (var i in arg.ins) {
    var _in_ = new In(arg.ins[i])
    ins.push(_in_)
  }
  function getIns() { return _ins }
  self.getIns = getIns

  var _outs = []
  for (var o in arg.outs) {
    var _out_ = new Out(arg.outs[o])
    _outs.push(_out_)
  }
  function getOuts() { return _outs }
  self.getOuts = getOuts

  function onTask() {
    _task(self)
    _runTask = true
  }
  self.on('task', onTask)
}

util.inherits(Node, Element)

function toJSON() {
  var json = {}

  json.position = this.getPosition()
  json.size = this.getSize()

  json.id = this.getId()

  json.ins  = []
  var ins = this.getIns()
  for (var i = 0; i < ins.length; i++) json.ins.push(ins[i].toJSON())

  json.outs = [] // TODO

  return json
}
Node.prototype.toJSON = toJSON

module.exports = Node

