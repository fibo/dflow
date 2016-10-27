const Canvas = require('flow-view').Canvas
const path = require('path')

const graphName = process.argv[2]

const view = require(path.join(__dirname, '..', 'graphs', `${graphName}.json`)).view

const canvas = new Canvas('drawing')

canvas.render(view, null, function (err, outputSVG) {
  if (err) throw err

  console.log(outputSVG)
})
