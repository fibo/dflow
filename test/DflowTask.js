var DflowGraph, DflowTask, IperNode, dflow, graph, iper;

dflow = require('../index');

iper = require('iper');

IperNode = iper.IperNode;

DflowTask = dflow.DflowTask;

DflowGraph = dflow.DflowGraph;

graph = new DflowGraph();

describe('DflowTask', function() {
  describe('Inheritance', function() {
    return it('is an IperNode');
  });
  describe('Constructor', function() {});
  describe('Attributes', function() {});
  return describe('Methods', function() {});
});
