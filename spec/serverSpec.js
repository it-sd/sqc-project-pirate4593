const { queryAllMovies } =
  require('../server.js')

describe('media server', function () {
  const baseUrl = 'http://localhost:5163'
  const shouldBe200 = async function (route) {
    it('should return 200', async function () {
      const url = new URL(route, baseUrl)
      const res = await fetch(url)
      expect(res.status).toBe(200)
    }, 10000)
  }

  describe("GET '/'", function () {
    shouldBe200('/')
  })

  describe("GET '/about'", function () {
    shouldBe200('/about')
  })

  describe("GET '/health'", function () {
    shouldBe200('/health')
  })

  describe("GET '/mlist'", function () {
    shouldBe200('/mlist')
  })

  describe('queryAllMovies', function () {
    it('should return at least one movie', async function () {
      const results = await queryAllMovies()
      expect(results).toBeDefined()
      expect(results.movies).toBeDefined()
      expect(results.movies.length).toBeGreaterThan(0)
    })
  })
})

