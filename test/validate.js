
var should = require('should')
var validate = require('../src/validate')

describe('validate', function () {
  it('is aware that undefined argIndex means 0', function () {
    validate({
               task: { '1': 'x', '2': 'x' } ,
               pipe: {
                 'a': [ '1', '2' ] // pipe['a'][2] here defaults to 0
               }
             }).should.be.ok
  })

  it('throws if pipe or task is not an object', function () {
    ;(function () { validate({ task: 'not an object', pipe: {} }) }).should.throwError(/Not an object: task/)

    ;(function () { validate({ pipe: 'not an object', task: {} }) }).should.throwError(/Not an object: pipe/)
  })

  it('throws if some pipe has invalid type', function () {
    ;(function () { validate({ task: {}, pipe: { '1': [ '1', '2', 'zero' ] } }) }).should.throwError(/Invalid pipe:/)

    ;(function () { validate({ task: {}, pipe: { '1': [ '1', 2, 0 ] } }) }).should.throwError(/Invalid pipe:/)

    ;(function () { validate({ task: {}, pipe: { '1': [ 1, '2', 0 ] } }) }).should.throwError(/Invalid pipe:/)
  })

  it('throws if pipe has duplicates', function () {
    ;(function () {
        validate(
          { task: { '1': 'foo', '2': 'bar' },
            pipe: {
             'a': [ '1', '2', 1 ],
             'b': [ '1', '2', 1 ],
            }
          })
      }).should.throwError(/Duplicated pipe:/)

    ;(function () {
        validate(
          { task: { '1': 'foo', '2': 'bar' },
            pipe: {
             'a': [ '1', '2', 0 ],
             'b': [ '1', '2' ] // Since pipe['b'][2] defaults to 0, pipe['b'] is a duplicate.
            }
          })
      }).should.throwError(/Duplicated pipe:/)
  })

  it('throws if some pipe is orphan', function () {
    ;(function () {
        validate(
          { task: {},
            pipe: {
             'a': [ '1', '2', 0 ]
            }
          })
      }).should.throwError(/Orphan pipe:/)
  })
})

