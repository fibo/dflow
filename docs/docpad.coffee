# DocPad Configuration File
# http://docpad.org/docs/config

pgk = require('../package.json')

# Define the DocPad Configuration
docpadConfig = {
	layoutsPaths: [ 'common/layouts' ]
	plugins:
		partials:
			partialsPath: 'common/partials'
}

# Export the DocPad Configuration
module.exports = docpadConfig

