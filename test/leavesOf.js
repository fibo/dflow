
var should = require('should')
var leavesOf = require('../src/leavesOf')

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

describe('leavesOf', function () {
  it('returns leaves tasks', function () {
    leavesOf(graph).should.eql([tasks[2], tasks[3]])
  })
})

