
var should = require('should')
var outputPipesOf = require('../src/outputPipesOf')

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

describe('outputPipesOf', function () {
  it('returns output pipes of task', function () {
    outputPipesOf(pipes, tasks[0]).should.eql([pipes[0]])

    outputPipesOf(pipes, tasks[1]).should.eql([pipes[1], pipes[2]])

    outputPipesOf(pipes, tasks[2]).should.eql([pipes[3]])

    outputPipesOf(pipes, tasks[3]).should.eql([])
  })
})

