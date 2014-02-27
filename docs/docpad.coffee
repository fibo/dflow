# DocPad Configuration File
# http://docpad.org/docs/config

pkg = require('../package.json')

docpadConfig = {
  templateData: {
    pkg: pkg
  }
}

module.exports = docpadConfig

