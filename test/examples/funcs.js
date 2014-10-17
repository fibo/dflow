
module.exports = {
  'console.log': console.log.bind(console),
  '+': function plus (a, b) { return a + b },
  'one': function one () { return 1 }
}

