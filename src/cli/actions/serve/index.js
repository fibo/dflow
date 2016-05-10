var nopt = require('nopt')
var usage = require('./usage')

var knownOpts = {
  help: Boolean
}

var shortHandOpts = {
  h: '--help'
}

module.exports = (args) => {
  var opt = nopt(knownOpts, shortHandOpts, args, 3)

  if (opt.help) {
    console.log(usage)
    process.exit(0)
  }
}
