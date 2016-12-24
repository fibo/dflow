var regexArgument = require('./regex/argument')
var regexComment = require('./regex/comment')
var regexDotOperator = require('./regex/dotOperator')
var regexReference = require('./regex/reference')
var regexSubgraph = require('./regex/subgraph')

function isDflowDSL (taskName) {
  if (regexArgument.exec(taskName)) return true
  if (regexComment.test(taskName)) return true
  if (regexDotOperator.func.test(taskName)) return true
  if (regexDotOperator.attrRead.test(taskName)) return true
  if (regexDotOperator.attrWrite.test(taskName)) return true
  if (regexReference.exec(taskName)) return true
  if (regexSubgraph.test(taskName)) return true

  return false
}

module.exports = isDflowDSL
