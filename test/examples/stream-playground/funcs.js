
var fs = require('fs')
var path = require('path')

module.exports = {
  input: function () { return path.join(__dirname,'./input/people.json') },
  output: function () { return path.join(__dirname,'./output/people.json') },
  createReadStream: function (input) {
    return fs.createReadStream(input)
  },
  createWriteStream: function (input, output) {
    return input.pipe(fs.createWriteStream(output))
  }
}

