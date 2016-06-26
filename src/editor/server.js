var budo = require('budo')
var path = require('path')
var babelify = require('babelify')
var livereactload = require('livereactload')
var no = require('not-defined')

var graph = require('./middleware/graph').handler
var info = require('./middleware/info').handler

function start (opt) {
  if (no(opt)) opt = {}

  budo(path.join(__dirname, 'index.js'), {
    open: opt.open,
    debug: true,
    title: 'dflow',
    stream: process.stdout,
    browserify: {
      transform: babelify,
      plugin: livereactload
    },
    middleware: [
      graph(opt.graphPath),
      info
    ]
  })
}

exports.start = start
