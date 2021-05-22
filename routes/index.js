const express = require('express')
const Movie = require('../models/movie')
const router = express.Router()

router.get('/', async (req, res) => {
  
  let movies
  try {
      movies = await Movie.find().sort({ createdAt: 'desc' }).limit(10).exec()
      
  } catch {
     movies = []
    }
    res.render('index', { movies: movies })
  })

module.exports = router