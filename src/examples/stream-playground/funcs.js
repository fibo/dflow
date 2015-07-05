
var fs = require('fs')
var path = require('path')

module.exports = {
  input: function () { return path.join(__dirname, './input/people.json') },
  output: function () { return path.join(__dirname, './output/people.json') },
  createReadStream: function (inputPath) {
    var stream =  fs.createReadStream(inputPath)

    return stream
  },
  createWriteStream: function (inputStream, outputPath) {
    var stream = fs.createWriteStream(outputPath)

    inputStream.pipe(stream)

    return stream
  }
}

