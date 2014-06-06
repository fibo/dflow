
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

        global.console.dir = function () {}
        global.console.log = function () {}

        dflow.evaluate(graph)

        // restore original console
        global.console.dir = dir
        global.console.log = log
      })
    })
  })
})

