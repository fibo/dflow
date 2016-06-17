var budo = require('budo')
var path = require('path')
var babelify = require('babelify')
var getInfo = require('./middleware/getInfo').handler
var livereactload = require('livereactload')

function start () {
  budo(path.join(__dirname, 'index.js'), {
    stream: process.stdout,
    debug: true,
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
