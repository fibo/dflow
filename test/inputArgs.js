
var should = require('should')
var inputArgs = require('../src/inputArgs')

var graph = {
  tasks: [
    { key: '0' },
    { key: '1' },
    { key: '2' },
    { key: '3' }
  ],
  pipes: [
    { key: 'a', from: { key: '0' }, to: { key: '1', arg: 0 } },
    { key: 'b', from: { key: '1' }, to: { key: '2', arg: 0 } },
    { key: 'c', from: { key: '2' }, to: { key: '3', arg: 0 } },
    { key: 'd', from: { key: '1' }, to: { key: '3', arg: 1 } }
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

