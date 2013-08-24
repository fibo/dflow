var DflowGraph, DflowInput, DflowTask, IperNode, dflow, emptyTask, graph, iper, task;

dflow = require('../index');

iper = require('iper');

DflowGraph = dflow.DflowGraph;

DflowInput = dflow.DflowInput;

DflowTask = dflow.DflowTask;

IperNode = iper.IperNode;

graph = new DflowGraph();

emptyTask = function() {};

task = new DflowTask(graph, emptyTask);

describe('DflowInput', function() {
  describe('Inheritance', function() {
    return it('is an IperNode', function() {
      var input;
      input = new DflowInput(task, 'in');
      return input.should.be.instanceOf(IperNode);
    });
  });
  return describe('Constructor', function() {
    it('has signature (task, name)', function() {
      var input;
      input = new DflowInput(task, 'in');
      return input.should.be.instanceOf(IperNode);
    });
    return it('has signature (task, {name: , ...})', function() {});
  });
});
