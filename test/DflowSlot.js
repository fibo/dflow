var DflowGraph, DflowSlot, DflowTask, dflow, graph, iper;

dflow = require('../index');

iper = require('iper');

DflowGraph = dflow.DflowGraph;

DflowSlot = dflow.DflowSlot;

DflowTask = dflow.DflowTask;

graph = new DflowGraph();

describe('DflowSlot', function() {
  describe('Inheritance', function() {
    return it('is a DflowSlot', function() {
      var slot;
      slot = new DflowSlot(graph);
      return slot.should.be.instanceOf(DflowSlot);
    });
  });
  return describe('Constructor', function() {
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
});
