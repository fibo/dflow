
dflow = require '../index'
iper  = require('iper')

DflowGraph = dflow.DflowGraph
DflowInput = dflow.DflowInput
DflowTask  = dflow.DflowTask

IperNode = iper.IperNode

graph = new DflowGraph()
emptyTask = () ->
task = new DflowTask(graph, emptyTask)

describe 'DflowInput', ->
  describe 'Inheritance', ->
    it 'is an IperNode', ->
      input = new DflowInput(task)
      input.should.be.instanceOf IperNode

  describe 'Constructor', ->
    it 'has signature (task, data, meta)', ->

