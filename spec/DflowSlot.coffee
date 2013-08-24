
dflow = require '../index'
iper  = require('iper')

DflowGraph = dflow.DflowGraph
DflowSlot  = dflow.DflowSlot
DflowTask  = dflow.DflowTask
DflowInput = dflow.DflowInput
DflowOutput = dflow.DflowOutput

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

  describe 'Attributes', ->
    data = 'foo'
    slot = new DflowSlot(graph, data)

    describe '#in', ->
      it 'is a DflowInput', ->
        slot.in.should.be.instanceOf DflowInput

      it 'is filled with data', ->
        slot.in.value.should.eql data

    describe '#out', ->
      it 'is a DflowOutput', ->
        slot.out.should.be.instanceOf DflowOutput

      it 'is filled with data', ->
        slot.out.value.should.eql data

  describe 'Methods', ->
    describe '#runTask()', ->
      it 'fills out.data with in.data', ->
        data = 'foo'
        slot = new DflowSlot(graph, data)
