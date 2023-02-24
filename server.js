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
  return { movies: results }
}

module.exports = {
  queryAllMovies
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
    const movies = await queryAllMovies()
    res.render('pages/list', movies)
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

  .get('/health', (req, res) => {
    const result = query('SELECT id FROM media;')
    if (result.length === 0) {
      res.status(500).send('Unhealthy')
    } else {
      res.status(200).send('Healthy')
    }
  })

  .listen(PORT, () => console.log(`Listening on ${PORT}`))
