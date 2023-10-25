const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

const userRoute = require('./routes/users')
const secureRoute = require('./routes/secureroutes')

require('dotenv').config()

const uri = process.env.MONGO_URI

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, () => {
  console.log('mongodb server is running')
})

require('./passport')(passport)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())

app.use('/', userRoute)
app.use('/', passport.authenticate('jwt', { session: false }), secureRoute)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`express server is running on ${port}`))