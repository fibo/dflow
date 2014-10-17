
var should = require('should')
var parents = require('../src/parents')

var graph = {
  tasks: [
    { id: '0' },
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ],
  pipes: [
    { id: 'a', from: { id: '0' }, to: { id: '1' } },
    { id: 'b', from: { id: '1' }, to: { id: '2' } },
    { id: 'c', from: { id: '1' }, to: { id: '3' } },
    { id: 'd', from: { id: '2' }, to: { id: '3' } }
  ]
}

var parentsOf = parents.bind(null, graph)
  , tasks = graph.tasks

describe('parentsOf', function () {
  it('returns parent tasks of task', function () {
    parentsOf(tasks[0]).should.eql([])

    parentsOf(tasks[1]).should.eql([tasks[0]])

    parentsOf(tasks[2]).should.eql([tasks[1]])

    parentsOf(tasks[3]).should.eql([tasks[1], tasks[2]])
  })
})

