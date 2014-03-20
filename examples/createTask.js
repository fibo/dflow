
var Foo = require('./Foo.js')
  , should = require('should')


var foo = new Foo()

foo.out.data = 5
foo.in.data = 5
foo.run()
foo.out.data.should.be.eql(5)

