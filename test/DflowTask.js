var DflowGraph, DflowTask, IperNode, dflow, emptyTask, graph, iper;

dflow = require('../index');

iper = require('iper');

IperNode = iper.IperNode;

DflowTask = dflow.DflowTask;

DflowGraph = dflow.DflowGraph;

graph = new DflowGraph();

emptyTask = function() {};

describe('DflowTask', function() {
  describe('Inheritance', function() {
    return it('is an IperNode', function() {
      var task;
      task = new DflowTask(graph, emptyTask);
      return task.should.be.instanceOf(IperNode);
    });
  });
  describe('Constructor', function() {
    it('has signature (graph, task)', function() {
      var task;
      task = new DflowTask(graph, emptyTask);
      return task.should.be.instanceOf(IperNode);
    });
    return it('has signature (graph, {task: task, inputs: {...}, outputs: {...}})', function() {});
  });
  return describe('Methods', function() {
    describe('#createInput()', function() {});
    describe('#createOutput()', function() {});
    return describe('#runTask()', function() {
      return it('runs task passing a reference to the DflowTask instance', function() {});
    });
  });
});
