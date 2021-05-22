const express = require('express')
const router = express.Router()
const Director = require('../models/director')
const Movie = require('../models/movie')

// All directors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
      searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
      const directors = await Director.find(searchOptions)
      res.render('directors/index', {
        directors: directors,
        searchOptions: req.query
      })
    } catch {
      res.render('/')
    }
})

router.get('/new' ,(req,res) => {
    res.render('directors/new', {director: new Director()})
})

//create director
router.post('/', async(req,res) =>{
    const director = new Director({
        name: req.body.name
    })
    try {
        console.log(director)
        const newDirector = await director.save()
        res.redirect(`directors/${newDirector.id}`)
    } catch(err){
        console.log('error' + err)
        let locals = { errorMessage: "something went wrong"}
        res.render('directors/new', {
            locals: locals,
            director: director
        })
    }  

})

// directors show route
router.get('/:id', async (req,res) =>{
  try{
    const director = await Director.findById(req.params.id)
    const movies = await Movie.find({ director: director.id}).limit(6).exec()
    res.render('directors/show', {
      director: director,
      moviesByDirector: movies
    })
  }catch{
    res.redirect('/')
  }
})

//edit director route
router.get('/:id/edit', async (req,res)=>{
  try {
    const director = await Director.findById(req.params.id)
    res.render('directors/edit', {director: director})
  } catch (error) {
    res.redirect('/directors')
  }
})

//put to update director
router.put('/:id', async (req,res)=>{
  let director
  try{
    director = await Director.findById(req.params.id)
    director.name = req.body.name
    await director.save()
    res.redirect(`/directors/${director.id}`)
  }catch{
    if(director == null){
      res.redirect('/')
    }
    else{
      res.render('directors/edit', {
        director: director,
        errorMessage: "Error updating Director"
      })
    }
  }
})

//voor put en delete library method override nodig
router.delete('/:id', async (req,res)=>{
  let director
  try{
    director = await Director.findById(req.params.id)
    await director.remove()
    res.redirect(`/directors/${director.id}`)
  }catch (err){
    console.log(err)
    if(director == null){
      res.redirect('/')
    }
    else{
      res.redirect(`/directors/${director.id}`)
    }
  }
})

module.exports = router