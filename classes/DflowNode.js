
//
// # DflowNode
//

var iper = require('iper')
  , inherits = require('inherits')

var IperNode = iper.IperNode

//
// ## Inheritance
//
// *DflowNode* inherits from [IperNode](http://www.g14n.info/iper/classes/IperNode.html)
//

//
// ## Constructor
//

function DflowNode () {

  IperNode.apply(this, arguments)

//
// ## Attributes
//

}

inherits(DflowNode, IperNode)

module.exports = DflowNode

