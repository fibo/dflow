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

console.log(remain)
