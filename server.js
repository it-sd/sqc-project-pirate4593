require('dotenv').config()
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5163

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
  const sql = `SELECT id, title, (SELECT MAX(id) FROM media) AS total
    FROM media
    WHERE media_type_id = 1
    ORDER BY id;`
  const results = await query(sql)
  return { medias: results }
}

const queryAllTVShows = async function () {
  const sql = `SELECT id, title, (SELECT MAX(id) FROM media) AS total
    FROM media
    WHERE media_type_id = 2
    ORDER BY id;`
  const results = await query(sql)
  return { medias: results }
}

const queryAllAnime = async function () {
  const sql = `SELECT id, title, (SELECT MAX(id) FROM media) AS total
    FROM media
    WHERE media_type_id = 3
    ORDER BY id;`
  const results = await query(sql)
  return { medias: results }
}

const queryMedia = async function (id) {
  const sql = `SELECT * FROM media WHERE number = $1`
  const results = await query(sql, [id])
  return results.length ? results[0] : []
}


module.exports = {
  queryAllMovies,
  queryAllTVShows,
  queryAllAnime,
  queryMedia
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function (req, res) {
    res.render('pages/index')
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

  .get('/anlist', async function (req, res) {
    const medias = await queryAllAnime()
    res.render('pages/list', medias)
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
    const media = await queryMedia(req.params.mediaId);
    res.render('pages/media', { media });
  })

  .get('/top250m', (req, res) => {
    res.render('pages/top')
  })

  .get('/top250tv', (req, res) => {
    res.render('pages/top')
  })

  .get('/comingsoon', (req, res) => {
    res.render('pages/')
  })

  .post('/vote', async function (req, res) {
    res.set({ 'Content-Type': 'application/json' })

    try {
      const client = await pool.connect()
      const id = Number(req.body.mediaId)

      if (!Number.isInteger(id) || id < 1) {
        console.error(`Unexpected media id of ${req.body.mediaId}`)
        res.status(400).json({ ok: false })
        return
      }

      let vote
      if (req.body.vote === 'Like') vote = 1
      else if (req.body.vote === 'Dislike') vote = 0
      else {
        console.error(`Unexpected vote of ${req.body.vote}`)
        res.status(400).json({ ok: false })
        return
      }

      const insertSql = `INSERT INTO vote (media_id, value)
        VALUES ($1::INTEGER, $2::FLOAT);`
      await client.query(insertSql, [id, vote])

      res.json({ ok: true })
      client.release()
    } catch (err) {
      console.error(err)
      res.json({ buttons: [], error: err })
    }
  })

  .listen(PORT, () => console.log(`Listening on ${PORT}`))
