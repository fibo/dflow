
var should = require('should')
var parents = require('../src/parents')

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

var parentsOf = parents.bind(null, pipes, tasks)

describe('parentsOf', function () {
  it('returns parent tasks of task', function () {
    parentsOf('0').should.eql([])

    parentsOf('1').should.eql([tasks[0]])

    parentsOf('2').should.eql([tasks[1]])

    parentsOf('3').should.eql([tasks[1], tasks[2]])
  })

  it('does not count twice', function () {
    tasks = [
      { key: '0', }, { key: '1' }
    ]
    pipes = [
      { key: 'a', from: '0', to: '1', arg: 0 },
      { key: 'b', from: '0', to: '1', arg: 1 }
    ]
    
    parentsOf('1').should.eql([tasks[0]]) // not [tasks[0], tasks[0]]
  })
})

