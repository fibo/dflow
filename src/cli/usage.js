var pkg = require('../../package.json')
var actions = require('./actions')

var homepage = pkg.homepage

function prepend (prefix) {
  return function (str) { return prefix + str }
}

var actionList = Object.keys(actions)
                       .map(prepend(' * '))
                       .join('\n')

module.exports = `
Usage: dflow [action] [options]

Available actions:
${actionList}

Available options:
  -h, --help          print usage and exit
  --version           print current version and exit

For more info point your browser to ${homepage}
`
