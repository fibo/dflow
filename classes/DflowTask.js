
//
// # DflowTask
//

var iper = require('iper')

var IperGraph = iper.IperGraph

var DflowInput = require('./DflowInput')
  , DflowOutput = require('./DflowOutput')

//
// ## Constructor
//

function DflowTask () {

//
// ## Attributes
//

//
// ### graph
//
// Is an instance of IperGraph
//

  var graph = new IperGraph()

  Object.defineProperty(this, 'graph', {
    enumerable: false,
    value: graph
  })

}

module.exports = DflowTask

