function coreNodeModules () {
  // TODO add more core node modules
  return [ 'http', 'https', 'net', 'path', 'readline', 'zlib' ]
}

exports.coreNodeModules = coreNodeModules

coreNodeModules().forEach(function (x) {
  exports[x] = function () { return require(x) }
})

exports.process = function () { return process }
