const express = require('express')
const router = express.Router()
const Actor = require('../models/actor')
const Movie = require('../models/movie')

router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
      searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
      const actors = await Actor.find(searchOptions)
      res.render('actors/index', {
        actors: actors,
        searchOptions: req.query
      })
    } catch {
      res.render('/')
    }
})




//new actor route
router.get('/new', (req, res) => {
    res.render('actors/new', {actor: new Actor})
})

// create actor
router.post('/', async(req,res)=>{
    const actor = new Actor({
        name: req.body.name
    })
    try{
        const newActor = await actor.save()
        res.redirect('actors')
    }catch (err){
        console.log(err)
        res.render('actors/new',{
            actor:actor
        })
    }
})

// Actors show route
router.get('/:id', async (req,res) =>{
  try{
    const actor = await Actor.findById(req.params.id)
    const movies = await Movie.find({ actor: actor.id}).limit(6).exec()
    res.render('actors/show', {
      actor: actor,
      moviesByActor: movies
    })
  }catch{
    res.redirect('/')
  }
})

//edit actor route
router.get('/:id/edit', async (req,res)=>{
  try {
    const actor = await Actor.findById(req.params.id)
    res.render('actors/edit', {actor: actor})
  } catch (error) {
    res.redirect('/actors')
  }
})

//put to update actor
router.put('/:id', async (req,res)=>{
  let actor
  try{
    actor = await Actor.findById(req.params.id)
    actor.name = req.body.name
    await actor.save()
    res.redirect(`/actors/${actor.id}`)
  }catch{
    if(actor == null){
      res.redirect('/')
    }
    else{
      res.render('actors/edit', {
        actor: actor,
        errorMessage: "Error updating Actor"
      })
    }
  }
})

//voor put en delete library method override nodig
router.delete('/:id', async (req,res)=>{
  let actor
  try{
    actor = await Actor.findById(req.params.id)
    await actor.remove()
    res.redirect(`/actors/${actor.id}`)
  }catch (err){
    console.log(err)
    if(actor == null){
      res.redirect('/')
    }
    else{
      res.redirect(`/actors/${actor.id}`)
    }
  }
})

module.exports = router