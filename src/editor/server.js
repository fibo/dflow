var budo = require('budo')
var path = require('path')
var babelify = require('babelify')
var getInfo = require('./middleware/getInfo').handler
var livereactload = require('livereactload')
var no = require('not-defined')

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
      getInfo
    ]
  })
}

exports.start = start
