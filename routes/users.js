const express = require('express')
const passport = require('passport')
const Jwt = require('jsonwebtoken')

const router = express.Router()
const User = require('../model/User')

router.post('/register', passport.authenticate('local-signup', { session: false }),async (req, res, next) => {
res.json({
  msg: 'Signup is successfull',
  user: req.user
})
})
router.post('/login', async (req, res, next) => { 
  passport.authenticate(
    'local-signin', async(err, user, info) => {
      if(err){ return next(err)}
  if(!user){ return res.json({ msg: 'Go register first' }) }

  req.logIn(user, { session: false }, async (err) => {
    if(err) { return next(err) }
    
    const payload = { id: user.id, email: user.email }
    const token = Jwt.sign(payload, process.env.SECRET)
    console.log(payload)
    return res.json({ user: req.user, msg: 'User has logged in successfully', token })
  })

    })(req, res, next)
  })


module.exports = router