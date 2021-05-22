const mongoose = require('mongoose')
const Movie = require('./movie')

const actorSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    }
})

actorSchema.pre('remove', function(next){
    Movie.find({ actor: this.id}, (err, movies)=>{
       if(err){
           next(err)
       } else if(movies.length > 0){
           next(new Error('This director has movies still'))
       }else {
           next()
       }
    })
})

module.exports = mongoose.model('Actor', actorSchema)