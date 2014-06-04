
var dflow = require('../index')
  , fs    = require('fs')
  , path  = require('path')

// silent console.log
dflow.register('console.log', function () {})

fs.readdir(path.join('examples', 'graphs'), function (err, files) {
  if (err) throw err

  files.forEach(function (file) {
    describe('example graph ' + file, function () {
      var graph

      it('require', function () {
        graph = require(path.join('..', 'examples', 'graphs', file))
      })

      it('evaluate', function () {
        dflow.evaluate(graph)
      })
    })
  })
})
