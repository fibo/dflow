var DflowGraph, IperGraph, dflow, graph, iper;

dflow = require('../index');

iper = require('iper');

DflowGraph = dflow.DflowGraph;

IperGraph = iper.IperGraph;

graph = new DflowGraph();

describe('DflowGraph', function() {
  describe('Inheritance', function() {
    return it('is an IperGraph');
  });
  describe('Constructor', function() {});
  describe('Attributes', function() {});
  return describe('Methods', function() {});
});
