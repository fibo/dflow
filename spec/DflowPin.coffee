
dflow = require '../index'
iper  = require('iper')

DflowGraph = dflow.DflowGraph
DflowPin   = dflow.DflowPin
DflowTask  = dflow.DflowTask

IperNode = iper.IperNode

graph = new DflowGraph()
emptyTask = () ->
task = new DflowTask(graph, emptyTask)

describe 'DflowPin', ->
  describe 'Inheritance', ->
    prop =
      name: 'foo'
      value: 'bar'

    it 'is an IperNode', ->
      pin = new DflowPin(task, prop)
      pin.should.be.instanceOf IperNode


    it 'checks that task is an IperNode', ->
      (() ->
         new DflowPin('not a task', prop)
      ).should.throwError()

  describe 'Constructor', ->
    it 'has signature (task, prop)', ->

