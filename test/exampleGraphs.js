
var dflow = require('../index')
  , fs    = require('fs')
  , path  = require('path')
  , _     = require('underscore')

var resultOf = {
//  'graph1': 'ciao 5', TODO why result is 'ciao -1' ?
  'graph2': 'The typeof Math.PI is number',
  'nameOfTask': 'Task has name Math.PI',
  'orOperator': 'true',
  'dotOperator': '3.141592653589793'
}

fs.readdir(path.join('examples', 'graphs'), function (err, files) {
  if (err) throw err

  files.forEach(function (file) {
    var example = path.basename(file, '.json')

    describe('example graph ' + example, function () {
      var graph

      it('require', function () {
        graph = require(path.join('..', 'examples', 'graphs', file))
      })

      it('evaluate', function () {
        var expected = resultOf[example]

        // silent oonsole
        var dir = global.console.dir
          , log = global.console.log

        dflow.register('console.dir', function () {})
        dflow.register('console.log', function () {})

        // Inject a fake console.log to check the expected result from an example
        if (typeof expected !== 'undefined') {
          dflow.register('console.log', function () {
            var result = _.toArray(arguments).join(' ')    
            result.should.eql(expected)
          })
        }

        dflow.evaluate(graph)

        // restore original console
        dflow.register('console.dir', dir)
        dflow.register('console.log', log)
      })
    })
  })
})

