
var should = require('should')
var level = require('../src/level')

var tasks = [
    { key: '0' },
    { key: '1' },
    { key: '2' },
    { key: '3' }
  ]
  , pipes = [
    { key: 'a', from: '0', to: '1' },
    { key: 'b', from: '1', to: '2' },
    { key: 'c', from: '1', to: '3' },
    { key: 'd', from: '2', to: '3' }
  ]

var levelOf = level.bind(null, pipes, tasks)

describe('level', function () {
  it('returns level of task', function () {
    levelOf('0').should.eql(0)

    levelOf('1').should.eql(1)

    levelOf('2').should.eql(2)

    levelOf('3').should.eql(3)
  })
})

