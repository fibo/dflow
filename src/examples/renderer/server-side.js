const Canvas = require('flow-view').Canvas
const path = require('path')
const write = require('write-file-utf8')

const graphName = process.argv[2]

const view = require(path.join(__dirname, '..', 'graphs', `${graphName}.json`)).view
const svgFile = path.join(__dirname, '..', '..', '..', 'docs', 'svg', `${graphName}.svg`)

const canvas = new Canvas('drawing')

canvas.render(view, null, function (err, outputSVG) {
  if (err) throw err

  write(svgFile, outputSVG)
})
