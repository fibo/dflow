
var should = require('should')
var level = require('../src/level')

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

