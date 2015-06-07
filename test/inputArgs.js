
var inputArgs = require('../src/inputArgs'),
    should    = require('should')

var pipe = {
      'a': [ '0', '1', 0 ],
      'b': [ '1', '2', 0 ],
      'c': [ '2', '3', 0 ],
      'd': [ '1', '3', 1 ]
    },
    outs = {
    '0': 'foo',
    '1': 'bar',
    '2': 'quz'
    }

var inputArgsOf = inputArgs.bind(null, outs, pipe)

describe('inputArgs', function () {
  it('returns input args of task', function () {
    inputArgsOf('0').should.eql([])

    inputArgsOf('1').should.eql(['foo'])

    inputArgsOf('2').should.eql(['bar'])

    inputArgsOf('3').should.eql(['quz', 'bar'])
  })
})

