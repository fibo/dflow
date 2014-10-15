
var should = require('should')
var inputPipesOf = require('../src/inputPipesOf')

var tasks = [
      { id: '0' },
      { id: '1' },
      { id: '2' },
      { id: '3' }
    ]
  , pipes = [
      { id: 'a', from: { id: '0' }, to: { id: '1' } },
      { id: 'b', from: { id: '1' }, to: { id: '2' } },
      { id: 'c', from: { id: '1' }, to: { id: '3' } },
      { id: 'd', from: { id: '2' }, to: { id: '3' } }
    ]

describe('inputPipesOf', function () {
  it('returns input pipes of task', function () {
    inputPipesOf(pipes, tasks[0]).should.eql([])

    inputPipesOf(pipes, tasks[1]).should.eql([pipes[0]])

    inputPipesOf(pipes, tasks[2]).should.eql([pipes[1]])

    inputPipesOf(pipes, tasks[3]).should.eql([pipes[2], pipes[3]])
  })
})

