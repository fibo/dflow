
var should = require('should')
var inputArgs = require('../src/inputArgs')

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
    { id: 'c', from: { id: '2' }, to: { id: '3', arg: 0 } },
    { id: 'd', from: { id: '1' }, to: { id: '3', arg: 1 } }
  ], 
  outs: {
    '0': 'foo',
    '1': 'bar',
    '2': 'quz'
  }
}

var inputArgsOf = inputArgs.bind(null, graph)
  , tasks = graph.tasks

describe('inputArgs', function () {
  it('returns input args of task', function () {
    inputArgsOf(tasks[0]).should.eql([])

    inputArgsOf(tasks[1]).should.eql(['foo'])

    inputArgsOf(tasks[2]).should.eql(['bar'])

    inputArgsOf(tasks[3]).should.eql(['quz', 'bar'])
  })
})

