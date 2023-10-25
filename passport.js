const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('./model/User')

module.exports = function (passport) {
passport.use('local-signup', new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try{
      const user = await User.create({ email, password })
      return done(null,user)
    }catch(error){
      done(error)
    }
  }
))
passport.use('local-signin', new LocalStrategy(
  { usernameField :'email', passwordField: 'password' },
  async (email, password, done) => {
    try{
      const user = await User.findOne({ email })
      if(!user){
        return done(null, false, { msg: 'User is not found in dbDatabase' })
      }
      const validate = await user.isValidPassword(password)
      if(!validate){
        return done(null, false, { msg: 'Wrong password'})
      }
      return done(null, user, { msg: 'User has logged in susseccfully' })
    }catch(error){
      done(error)
    }
  }
))
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
  }, async (payload, done) => {
    try{
       const user = await User.findById(payload.id)
       if(!user){
         return done(null, false)
       }
       done(null, user)
    }catch(error){
      done(error)
    }
  }
))
}