const fun = require('../../../engine/fun')
const nopt = require('nopt')
const no = require('not-defined')
const usage = require('./usage')
const utils = require('../../utils')

const dotJson = utils.dotJson
const appendCwd = utils.appendCwd

const knownOpts = {
  help: Boolean
}

const shortHandOpts = {
  h: '--help'
}

const showUsage = () => {
  console.log(usage)
  process.exit(0)
}

module.exports = (args) => {
  const opt = nopt(knownOpts, shortHandOpts, args, 3)

  const remain = opt.argv.remain

  if ((opt.help) || (remain.length === 0)) showUsage()

  const graphPath = remain.filter(dotJson)
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
