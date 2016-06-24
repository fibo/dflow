var nopt = require('nopt')
var usage = require('./usage')
var utils = require('../../utils')
var no = require('not-defined')
var fun = require('../../../engine/fun')

var dotJson = utils.dotJson
var appendCwd = utils.appendCwd

var knownOpts = {
  help: Boolean
}

var shortHandOpts = {
  h: '--help'
}

const showUsage = () => {
  console.log(usage)
  process.exit(0)
}

module.exports = (args) => {
  var opt = nopt(knownOpts, shortHandOpts, args, 3)

  var remain = opt.argv.remain

  if ((opt.help) || (remain.length === 0)) showUsage()

  var graphPath = remain.filter(dotJson)
                        .map(appendCwd)
                        .shift()

  if (no(graphPath)) showUsage()

  try {
    var graph = require(graphPath)

    if (graph.info && graph.info.context === 'client') {
      console.log('TODO: implement running client side, spawn a server...')
      process.exit(0)
    }

    // TODO Arguments of dflowFun should be passed as --arg 2016 --arg 12 --arg 18
    var dflowFunArgs = [2016, 12, 12]

    // var funcs = {} // TODO additional functions
    var f = fun(graph /* , funcs */)

    // TODO remove the console.log below, it is there just to check it is
    // working, try
    // node src/cli/dflow run src/examples/graphs/new.json
    console.log(f.apply(null, dflowFunArgs))
  } catch (err) {
    console.error(err)
  }
}
