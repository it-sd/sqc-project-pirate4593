require('dotenv').config()
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5163
const axios = require('axios');
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

const query = async function (sql, params) {
  let client
  let results = []
  try {
    client = await pool.connect()
    const response = await client.query(sql, params)
    if (response && response.rows) {
      results = response.rows
    }
  } catch (err) {
    console.error(err)
  }
  if (client) client.release()
  return results
}

const queryAllMovies = async function () {
  const sql = `SELECT id, imdb_id, title, (SELECT MAX(id) FROM media) AS total
    FROM media
    WHERE media_type_id = 1
    ORDER BY id;`
  const results = await query(sql)
  return { medias: results }
}

const queryAllTVShows = async function () {
  const sql = `SELECT id, imdb_id, title, (SELECT MAX(id) FROM media) AS total
    FROM media
    WHERE media_type_id = 2
    ORDER BY id;`
  const results = await query(sql)
  return { medias: results }
}

const queryMedia = async function (id) {
  const sql = `SELECT * FROM media WHERE imdb_id = $1`
  const results = await query(sql, [id])
  return results.length ? results[0] : []
}

const top250 = async function (type) {
try {
  const response = await axios.get(`https://imdb-api.com/en/API/Top250${type}/${process.env.API_KEY}`, {
    method: 'GET',
    redirect: 'follow'
  })

  const topMedia = response.data.items.slice(0, 250)

  const mediaData = topMedia.map((media) => ({
    title: media.title,
    poster: media.image,
    id: media.id
  }))

  return mediaData
} catch (err) {
  console.log(err)
}
return false
}


module.exports = {
  queryAllMovies,
  queryAllTVShows,
  queryMedia,
  top250
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', async function (req, res) {
    try {
      const response = await fetch(`https://imdb-api.com/en/API/InTheaters/${process.env.API_KEY}`)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
  
      const mostPopular = await response.json()
      const media = mostPopular.items.map((media) => ({
        title: media.title,
        poster: media.image,
        id: media.id
      }))
      res.render('pages/index', { media })
    } catch (err) {
      console.log(err)
      res.json({ error: 'There was an error with your request' })
    }
  })

  .get('/mpmovie', async function (req, res) {
    try {
      const response = await fetch(`https://imdb-api.com/en/API/MostPopularMovies/${process.env.API_KEY}`)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
  
      const mostPopular = await response.json()
      const media = mostPopular.items.map((media) => ({
        title: media.title,
        poster: media.image,
        id: media.id
      }))
      res.render('pages/popular', { media })
    } catch (err) {
      console.log(err)
      res.json({ error: 'There was an error with your request' })
    }
  })

  .get('/mptv', async function (req, res) {
    try {
      const response = await fetch(`https://imdb-api.com/en/API/MostPopularTVs/${process.env.API_KEY}`)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
  
      const mostPopular = await response.json()
      const media = mostPopular.items.map((media) => ({
        title: media.title,
        poster: media.image,
        id: media.id
      }))
      res.render('pages/popular', { media })
    } catch (err) {
      console.log(err)
      res.json({ error: 'There was an error with your request' })
    }
  })

  .get('/about', (req, res) => {
    res.render('pages/about')
  })

  .get('/mlist', async function (req, res) {
    const medias = await queryAllMovies()
    res.render('pages/list', medias)
  })

  .get('/tvlist', async function (req, res) {
    const medias = await queryAllTVShows()
    res.render('pages/list', medias)
  })

  .get('/search', async function (req, res) {
    const searchInput = req.query.search
    const searchType = req.query.type
    try {
      const response = await fetch(`https://imdb-api.com/en/API/Search${searchType}/${process.env.API_KEY}/${searchInput}`)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
  
      const searchResults = await response.json()
      const media = searchResults.results.map((media) => ({
        title: media.title,
        poster: media.image,
        mediaType: media.type,
        id: media.id
      }))
      res.render('pages/search', { media })
    } catch (err) {
      console.log(err)
      res.json({ error: 'There was an error with your request' })
    }
  })

  .get('/top250m', async function (req, res) {
    const media = await top250('Movies')
    res.render('pages/top', { media: media })
  })
  
  .get('/top250tv', async function (req, res) {
    const media = await top250('TVs')
    res.render('pages/top', { media: media })
  })
  
  .get('/comingsoon', async function (req, res) {
    try {
      const response = await fetch(`https://imdb-api.com/en/API/ComingSoon/${process.env.API_KEY}`)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
  
      const comingSoon = await response.json()
      const media = comingSoon.items.map((media) => ({
        title: media.title,
        poster: media.image,
        mediaType: media.type,
        id: media.id,
        releaseDate: media.releaseState
      }))
      res.render('pages/soon', { media })
    } catch (err) {
      console.log(err)
      res.json({ error: 'There was an error with your request' })
    }
  })

  .get('/health', async function (req, res) {
    const count = await query('SELECT COUNT(*) AS total FROM media;')
    if (count.length > 0 && count[0].total > 1) {
      res.status(200).send('healthy')
    } else {
      res.status(500).send('database unhealthy')
    }
  })

  .get('/:mediaId', async function (req, res) {
    const client = await pool.connect()
    const selectSql = 'SELECT imdb_id FROM media WHERE imdb_id = $1::text'
    const result = await client.query(selectSql, [req.params.mediaId])
    if (result.rows.length === 1) {
      const media = await queryMedia(req.params.mediaId);
      res.render('pages/media', { media });
    } else {
    try {
      const response = await fetch(`https://imdb-api.com/en/API/Title/${process.env.API_KEY}/${req.params.mediaId}`, {
        method: 'GET',
        redirect: 'follow'
      })
    
      const imdbMedia = await response.json()
    
      const media = {
        title: imdbMedia.title,
        poster: imdbMedia.image,
        description: imdbMedia.plot,
        genre: imdbMedia.genres,
        main_cast: imdbMedia.stars,
        id: imdbMedia.id,
        type: imdbMedia.type,
        lang: imdbMedia.languages,
        rating: imdbMedia.imDbRating
      }
      
      if (result.rows.length === 0) {
        // The data doesn't exist in the database, so we can insert it
        const insertSql = `INSERT INTO media (imdb_id, title, genre, description, main_cast, poster, media_type_id, lang, rating)
          VALUES ($1::TEXT, $2::TEXT, $3::TEXT, $4::TEXT, $5::TEXT, $6::TEXT, $7::INTEGER, $8::TEXT, $9::DECIMAL);`
        let type = 0
        if (media.type == 'Movie') type = 1
        else if (media.type == 'TVSeries') type = 2
        await client.query(insertSql, [media.id, media.title, media.genre, media.description, media.main_cast, media.poster, type, media.lang, media.rating])
      }
      res.render('pages/media', { media })
    } catch (err) {
      console.log(err)
    }
    }
  })

  .post('/vote', async function (req, res) {
    res.set({ 'Content-Type': 'application/json' })

    try {
      const client = await pool.connect()
      const id = req.body.mediaId

      let vote
      if (req.body.vote === 'Like') vote = 1
      else if (req.body.vote === 'Dislike') vote = 0
      else {
        console.error(`Unexpected vote of ${req.body.vote}`)
        res.status(400).json({ ok: false })
        return
      }
      let insertSql = `INSERT INTO vote (media_id, value)
      VALUES ($1::INTEGER, $2::FLOAT);`

      if (!Number(id)) {
       insertSql = `INSERT INTO vote (imdb_id, value)
        VALUES ($1::TEXT, $2::FLOAT);`
      } else if (id > 0) {
        insertSql = `INSERT INTO vote (media_id, value)
        VALUES ($1::INTEGER, $2::FLOAT);`
      } else {
        res.json({ ok: false})
      }
      await client.query(insertSql, [id, vote])

      res.json({ ok: true })
      client.release()
    } catch (err) {
      console.error(err)
      res.json({ buttons: [], error: err })
    }
  })

  .listen(PORT, () => console.log(`Listening on ${PORT}`))
