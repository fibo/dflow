# DocPad Configuration File
# http://docpad.org/docs/config

pkg = require('../package.json')

docpadConfig = {
  templateData: {
    site: {
      description: pkg.description
      title:       pkg.name
      keywords:    pkg.keywords
    }
  }
}

module.exports = docpadConfig




