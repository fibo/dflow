
dflow = require '../index'
iper  = require('iper')

DflowGraph = dflow.DflowGraph
DflowSlot  = dflow.DflowSlot
DflowTask  = dflow.DflowTask

graph = new DflowGraph()

describe 'DflowSlot', ->
  describe 'Inheritance', ->
    it 'is a DflowSlot', ->
      slot = new DflowSlot(graph)
      slot.should.be.instanceOf DflowSlot

  describe 'Constructor', ->
    it 'has signature (graph)', ->
      slot = new DflowSlot(graph)
      slot.should.be.instanceOf DflowSlot

    it 'has signature (graph, data)', ->
      data = 'foo'
      slot = new DflowSlot(graph, data)
      slot.should.be.instanceOf DflowSlot

