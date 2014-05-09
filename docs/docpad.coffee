# DocPad Configuration File
# http://docpad.org/docs/config

pkgData = require('../package.json')
doxData = require('./src/files/json/dox.json')

docpadConfig = {
  templateData: {
    dox: doxData
    pkg: pkgData
    bootstrap: {
      cdn: '//netdna.bootstrapcdn.com/bootstrap/3.1.1'
    }
  }
}

module.exports = docpadConfig

