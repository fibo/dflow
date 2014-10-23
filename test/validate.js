
var should = require('should')
var validate = require('../src/validate')

describe('validate', function () {
  it('throws if pipe or task is not an object', function () {
    ;(function () { validate({ task: 'not an object', pipe: {} }) }).should.throwError(/Not an object: task/)

    ;(function () { validate({ pipe: 'not an object', task: {} }) }).should.throwError(/Not an object: pipe/)
  })

  it('throws if some pipe has arg, from or to with invalid type', function () {
    ;(function () { validate({ task: {}, pipe: { '1': { from: '1', to: '2', arg: 'zero' } } }) }).should.throwError(/Not a number: pipe/)

    ;(function () { validate({ task: {}, pipe: { '1': { from: '1', to: 2, arg: 0 } } }) }).should.throwError(/Not a string: pipe/)

    ;(function () { validate({ task: {}, pipe: { '1': { from: 1, to: '2', arg: 0 } } }) }).should.throwError(/Not a string: pipe/)
  })

  it('throws if pipe has duplicates', function () {
    ;(function () {
        validate(
          { task: { '1': { func: 'foo' }, '2': { func: 'bar' } },
            pipe: {
             'a': { from: '1', to: '2', arg: 0 },
             'b': { from: '1', to: '2', arg: 0 },
            }
          })
      }).should.throwError(/Duplicated pipe/)
  })

  it('throws if some pipe is orphan'/*, function () {
    ;(function () {
        validate(
          { task: {},
            pipe: {
             'a': { from: '1', to: '2', arg: 0 }
            }
          })
      }).should.throwError(/Orphan pipe/)
  }*/)
})

