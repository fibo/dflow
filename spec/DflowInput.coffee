
dflow = require '../index'
iper  = require('iper')

DflowGraph = dflow.DflowGraph
DflowInput = dflow.DflowInput
DflowPin   = dflow.DflowPin
DflowTask  = dflow.DflowTask

graph = new DflowGraph()
emptyTask = () ->
task = new DflowTask(graph, emptyTask)

describe 'DflowInput', ->
  describe 'Inheritance', ->
    it 'is a DflowPin', ->
      prop =
        value: 1
        name: 'foo'
      input = new DflowInput(task, prop)
      input.should.be.instanceOf DflowPin

  describe 'Constructor', ->
    it 'has signature (task, prop)', ->
      prop =
        value: 1
        name: 'foo'
      input = new DflowInput(task, prop)
      input.should.be.instanceOf DflowPin

