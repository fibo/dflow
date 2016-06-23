var budo = require('budo')
var path = require('path')
var babelify = require('babelify')
var livereactload = require('livereactload')
var no = require('not-defined')

var getGraph = require('./middleware/getGraph').handler
var getInfo = require('./middleware/getInfo').handler

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
      getGraph,
      getInfo
    ]
  })
}

exports.start = start
