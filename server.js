const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

//routes
const methodOverride = require('method-override')
const indexRouter = require('./routes/index')
const moviesRouter = require('./routes/movies')
const actorsRouter = require('./routes/actors')
const directorsRouter = require('./routes/directors')

app.set('layout', 'layouts/layout')
app.set('view engine','ejs',)
app.set('views', __dirname + '/views')

app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb' , extended: false}))


mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true})
const db = mongoose.connection
db.on('error',error => console.error(error))
db.once('open',() => console.error('CONNECTED to mongoose'))


app.use('/', indexRouter)
app.use('/movies', moviesRouter)
app.use('/directors', directorsRouter)
app.use('/actors', actorsRouter)

console.log('server running')
app.listen(process.env.port || 3000)