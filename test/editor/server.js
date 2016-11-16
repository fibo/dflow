const request = require('supertest')

const app = require('editor/server')

const resource = (path) => ({
  hasContentType: (contentType) => {
    it(`is ${contentType}`, (done) => {
      request(app).get(path)
        .expect('Content-Type', contentType)
        .expect(200)
        .end((err, res) => done(err))
    })
  }
})

describe('editor server', () => {
  describe('GET /', () => {
    resource('/').hasContentType('text/html')
  })

  describe('GET /bundle.js', () => {
    resource('/bundle.js').hasContentType('text/javascript')
  })

  describe('GET /style.css', () => {
    resource('/style.css').hasContentType('text/css')
  })
})
