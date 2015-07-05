
var injectDotOperators = require('../src/inject/dotOperators'),
    should             = require('should')

describe('injectdotOperators', function () {
  it('modifies funcs object with accessors injected', function () {
    var data,
        funcs = {
          proc: function () { return process }
        },
        graph = {
          task: {
            '1': '.version'
          }
        }

    injectDotOperators(funcs, graph)

    var getVersion = funcs['.version']

    getVersion(process).should.be.eql(process.version)
  })
})

