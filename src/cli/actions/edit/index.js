// var createEmptyGraph = require('../../engine/createEmptyGraph')
// var fs = require('fs')
var nopt = require('nopt')
var path = require('path')
var usage = require('./usage')

var knownOpts = {
  help: Boolean
}
var shortHandOpts = {
  h: '--help'
}

var opt = nopt(knownOpts, shortHandOpts, process.argv, 3)

if (opt.help) {
  console.log(usage)
  process.exit(0)
}

var remain = opt.argv.remain

function appendCurrentWorkingDir (givenPath) {
  return path.join(process.cwd(), givenPath)
}

var graphPath = remain.map(appendCurrentWorkingDir)

function checkGraphPath (err, stats) {
  if (err && err.code === 'ENOENT') {
//    createEmptyGraph(graphPath, editorServer.bind(null, graphPath, opt))
  } else {
    if (stats.isFile()) {
//      editorServer(graphPath, opt)
    }
  }
}

if (typeof graphPath === 'undefined') {
//  editorServer(graphPath, opt)
} else {
//  fs.stat(graphPath, checkGraphPath)
}
