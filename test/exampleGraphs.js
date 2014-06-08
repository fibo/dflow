
var dflow = require('../index')
  , fs    = require('fs')
  , path  = require('path')

fs.readdir(path.join('examples', 'graphs'), function (err, files) {
  if (err) throw err

  files.forEach(function (file) {
    describe('example graph ' + file, function () {
      var graph

      it('require', function () {
        graph = require(path.join('..', 'examples', 'graphs', file))
      })

      it('evaluate', function () {
        // silent console
        var dir = global.console.dir
          , log = global.console.log

        dflow.register('console.dir', function () {})
        dflow.register('console.log', function () {})

        dflow.evaluate(graph)

        // restore original console
        dflow.register('console.dir', dir)
        dflow.register('console.log', log)
      })
    })
  })
})

