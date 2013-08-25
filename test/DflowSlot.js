var DflowGraph, DflowInput, DflowOutput, DflowSlot, DflowTask, dflow, graph, iper;

dflow = require('../index');

iper = require('iper');

DflowGraph = dflow.DflowGraph;

DflowSlot = dflow.DflowSlot;

DflowTask = dflow.DflowTask;

DflowInput = dflow.DflowInput;

DflowOutput = dflow.DflowOutput;

graph = new DflowGraph();

describe('DflowSlot', function() {
  describe('Inheritance', function() {
    return it('is a DflowSlot', function() {
      var slot;
      slot = new DflowSlot(graph);
      return slot.should.be.instanceOf(DflowSlot);
    });
  });
  describe('Constructor', function() {
    it('has signature (graph)', function() {
      var slot;
      slot = new DflowSlot(graph);
      return slot.should.be.instanceOf(DflowSlot);
    });
    it('defaults #in and #out to empty pins', function() {
      var slot;
      slot = new DflowSlot(graph);
      slot["in"].isEmpty.should.be["true"];
      return slot.out.isEmpty.should.be["true"];
    });
    return it('has signature (graph, value)', function() {
      var slot, value;
      value = 'foo';
      slot = new DflowSlot(graph, value);
      return slot.should.be.instanceOf(DflowSlot);
    });
  });
  return describe('Attributes', function() {
    var slot, value;
    value = 'foo';
    slot = new DflowSlot(graph, value);
    describe('#in', function() {
      it('is a DflowInput', function() {
        return slot["in"].should.be.instanceOf(DflowInput);
      });
      return it('is filled with value', function() {
        return slot["in"].value.should.eql(value);
      });
    });
    return describe('#out', function() {
      it('is a DflowOutput', function() {
        return slot.out.should.be.instanceOf(DflowOutput);
      });
      return it('is filled with input value', function() {
        slot.out.value.should.eql(value);
        value = 'bar';
        slot["in"].value = value;
        return slot.out.value.should.eql(value);
      });
    });
  });
});
