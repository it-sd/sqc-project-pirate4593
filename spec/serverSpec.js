const { 
  queryAllMovies, queryAllAnime, queryAllTVShows, queryMedia, top250 
} =
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

  describe("GET '/tvlist'", function () {
    shouldBe200('tvlist')
  })

  describe("GET '/anlist'", function () {
    shouldBe200('/anlist')
  })

  describe("GET '/top250m'", function () {
    shouldBe200('/top250m')
  })

  describe("GET '/top250tv'", function () {
    shouldBe200('/top250tv')
  })

  describe("GET '/1'", function () {
    shouldBe200('/1')
  })

  describe("POST '/vote'", function () {
    const url = 'http://localhost:5163/vote'

    it('should require an integer id', async function () {
      const data = {
        mediaId: 1.5,
        vote: 'like'
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      expect(response.ok).toBeFalse()
    })

    it('should require a non-zero id', async function () {
      const data = {
        mediaId: 0,
        vote: 'Like'
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      expect(response.ok).toBeFalse()
    })

    it('should require a positive id', async function () {
      const data = {
        storyId: -1,
        vote: 'Like'
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      expect(response.ok).toBeFalse()
    })

    it('should accept a like vote', async function () {
      const data = {
        mediaId: 1,
        vote: 'Like'
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      expect(response.ok).toBeTrue()

      const results = await response.json()
      expect(results.ok).toBeTrue()
    })

    it('should accept a dislike vote', async function () {
      const data = {
        mediaId: 1,
        vote: 'Dislike'
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      expect(response.ok).toBeTrue()

      const results = await response.json()
      expect(results.ok).toBeTrue()
    })

    it('should not accept non-like or dislike votes', async function () {
      const data = {
        mediaId: 1,
        vote: 'so-so'
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      expect(response.ok).toBeFalse()
    })
  })

  describe('queryAllMovies', function () {
    it('should return at least one movie', async function () {
      const results = await queryAllMovies()
      expect(results).toBeDefined()
      expect(results.medias).toBeDefined()
      expect(results.medias.length).toBeGreaterThan(0)
    })
  })

  describe('queryAllTVShows', function () {
    it('should return at least one TV Show', async function () {
      const results = await queryAllTVShows()
      expect(results).toBeDefined()
      expect(results.medias).toBeDefined()
      expect(results.medias.length).toBeGreaterThan(0)
    })
  })

  describe('queryAllAnime', function () {
    it('should return at least one Anime', async function () {
      const results = await queryAllAnime()
      expect(results).toBeDefined()
      expect(results.medias).toBeDefined()
      expect(results.medias.length).toBeGreaterThan(0)
    })
  })
  describe('top250', function () {
    it('should return 250 media items', async function () {
      const results = await top250('Movies')
      expect(results).toBeDefined()
      expect(results.length).toBe(250)
    })
  })
  describe('queryMedia', function () {
    beforeEach(async function () {
      this.results = await queryMedia(1)
    })

    const shouldHave = function (source, property) {
      expect(source).toBeDefined()
      expect(source[property]).toBeDefined()
      expect(source[property].length).toBeGreaterThan(0)
    }

    it('should return a title', function () {
      shouldHave(this.results, 'title')
    })
    it('should return a genre', function () {
      shouldHave(this.results, 'genre')
    })
    it('should return a description', function () {
      shouldHave(this.results, 'description')
    })
    it('should return cast information', function () {
      shouldHave(this.results, 'main_cast')
    })
    it('should return a poster', function () {
      shouldHave(this.results, 'poster')
    })
  })

})

