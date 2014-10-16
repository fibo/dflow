
var should = require('should')
var rootsOf = require('../src/rootsOf')

var tasks = [
      { id: '0' },
      { id: '1' },
      { id: '2' },
      { id: '3' }
    ]
  , pipes = [
      { id: 'a', from: { id: '0' }, to: { id: '1' } },
      { id: 'b', from: { id: '1' }, to: { id: '2' } }
    ]

var graph = {
  'pipes': pipes,
  'tasks': tasks
}

describe('rootsOf', function () {
  it('returns roots tasks', function () {
    rootsOf(graph).should.eql([tasks[0], tasks[3]])
  })
})

