
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

    it 'defaults #in and #out to empty pins', ->
      slot = new DflowSlot(graph)

      slot.in.isEmpty.should.be.true
      slot.out.isEmpty.should.be.true

    it 'has signature (graph, value)', ->
      value = 'foo'
      slot = new DflowSlot(graph, value)
      slot.should.be.instanceOf DflowSlot

  describe 'Attributes', ->
    value = 'foo'
    slot = new DflowSlot(graph, value)

    describe '#in', ->
      it 'is a DflowInput', ->
        slot.in.should.be.instanceOf DflowInput

      it 'is filled with value', ->
        slot.in.value.should.eql value

    describe '#out', ->
      it 'is a DflowOutput', ->
        slot.out.should.be.instanceOf DflowOutput

      it 'is filled with input value', ->
        slot.out.value.should.eql value

        value = 'bar'
        slot.in.value = value
        slot.out.value.should.eql value

