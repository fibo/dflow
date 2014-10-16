
var should = require('should')
var inputArgsOf = require('../src/inputArgsOf')

var graph = {
  tasks: [
    { id: '0' },
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ],
  pipes: [
    { id: 'a', from: { id: '0' }, to: { id: '1', arg: 0 } },
    { id: 'b', from: { id: '1' }, to: { id: '2', arg: 0 } },
    { id: 'c', from: { id: '1' }, to: { id: '3', arg: 1 } },
    { id: 'd', from: { id: '2' }, to: { id: '3' } }
  ], 
  outs: {
    '1': 'foo',
    '2': 'bar',
    '3': 'quz',
  }
}

describe('inputArgsOf', function () {
  it('returns input args of task', function () {
    inputArgsOf(graph, graph.tasks[0]).should.eql([])

    inputArgsOf(graph, graph.tasks[1]).should.eql(['foo'])
  })
})

