
var should = require('should')
var parents = require('../src/parents')

var graph = {
  tasks: [
    { key: '0' },
    { key: '1' },
    { key: '2' },
    { key: '3' }
  ],
  pipes: [
    { key: 'a', from: { key: '0' }, to: { key: '1' } },
    { key: 'b', from: { key: '1' }, to: { key: '2' } },
    { key: 'c', from: { key: '1' }, to: { key: '3' } },
    { key: 'd', from: { key: '2' }, to: { key: '3' } }
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

  it('does not count twice', function () {
    var graph = {
      tasks: [
        { key: '0' }, { key: '1' }
      ],
      pipes: [
        { key: 'a', from: { key: '0' }, to: { key: '1', arg: 0 } },
        { key: 'b', from: { key: '0' }, to: { key: '1', arg: 1 } }
      ]
    }
    , tasks = graph.tasks
    
    parentsOf(tasks[1]).should.eql([tasks[0]]) // not [tasks[0], tasks[0]]
  })
})

