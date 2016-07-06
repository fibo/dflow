var babelify = require('babelify')
var bodyParser = require('body-parser')
var budo = require('budo')
var livereactload = require('livereactload')
var no = require('not-defined')
var path = require('path')

var graph = require('./middleware/graph').handler
var info = require('./middleware/info').handler

function start (opt) {
  if (no(opt)) opt = {}

  budo(path.join(__dirname, 'index.js'), {
    browserify: {
      transform: babelify,
      plugin: livereactload
    },
    cors: true,
    debug: true,
    middleware: [
      bodyParser.json(),
      graph(opt.graphPath),
      info
    ],
    open: opt.open,
    stream: process.stdout,
    title: 'dflow'
  })
}

exports.start = start
