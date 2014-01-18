
var test = require('../examples')
  , should = require('should')

function exampleWorks(exampleTest) {
  it('example works', exampleTest)
}

for (var example in test)
  describe(example, exampleWorks(test[example]))

