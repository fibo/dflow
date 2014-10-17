
var should = require('should')
var level = require('../src/level')

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

var tasks = graph.tasks

var levelOf = level.bind(null, graph)

describe('level', function () {
  it('returns level of task', function () {
    levelOf(tasks[0]).should.eql(0)

    levelOf(tasks[1]).should.eql(1)

    levelOf(tasks[2]).should.eql(2)

    levelOf(tasks[3]).should.eql(3)
  })
})

