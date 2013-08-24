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
    return it('has signature (graph, data)', function() {
      var data, slot;
      data = 'foo';
      slot = new DflowSlot(graph, data);
      return slot.should.be.instanceOf(DflowSlot);
    });
  });
  describe('Attributes', function() {
    var data, slot;
    data = 'foo';
    slot = new DflowSlot(graph, data);
    describe('#in', function() {
      it('is a DflowInput', function() {
        return slot["in"].should.be.instanceOf(DflowInput);
      });
      return it('is filled with data', function() {
        return slot["in"].value.should.eql(data);
      });
    });
    return describe('#out', function() {
      it('is a DflowOutput', function() {
        return slot.out.should.be.instanceOf(DflowOutput);
      });
      return it('is filled with data', function() {
        return slot.out.value.should.eql(data);
      });
    });
  });
  return describe('Methods', function() {
    return describe('#runTask()', function() {
      return it('fills out.data with in.data', function() {
        var data, slot;
        data = 'foo';
        return slot = new DflowSlot(graph, data);
      });
    });
  });
});
