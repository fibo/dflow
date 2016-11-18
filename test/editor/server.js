const http = require('http')
const request = require('supertest')

var graph = require('engine/emptyGraph.json')
const editorServer = require('editor/server')

const app = http.createServer(editorServer({
  read: () => {
    return JSON.stringify(graph)
  },
  update: (newGraph) => {
    console.log(newGraph)
    graph = newGraph
  }
}))

const resource = (path) => ({
  hasContentType: (contentType) => {
    it(`is ${contentType}`, (done) => {
      request(app)
        .get(path)
        .expect('Content-Type', contentType)
        .expect(200)
        .end((err, res) => done(err))
    })
  }
})

describe('editor server', () => {
  describe('GET /', () => {
    resource('/').hasContentType('text/html; charset=UTF-8')
  })

  describe('GET /bundle.js', () => {
    resource('/bundle.js').hasContentType('text/javascript')
  })

  describe('GET /style.css', () => {
    resource('/style.css').hasContentType('text/css; charset=UTF-8')
  })

  describe('GET /graph', () => {
    resource('/graph').hasContentType('application/json; charset=UTF-8')
  })

  describe('PUT /graph', () => {
    it('updates graph'/*, (done) => {
      const newGraph = {}

      request(app)
        .put('/graph')
        .send(newGraph)
        .expect(200)
        .end((err, res) => {
          should.deepEqual(graph, newGraph)
          done(err)
        })
    }*/)
  })
})
