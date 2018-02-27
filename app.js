var express = require('express')
var session = require('express-session')
var passport = require('passport')
var OAuth2Strategy = require('passport-oauth2').Strategy
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var jwkToPem = require('jwk-to-pem')
var config = require('./config')
var index = require('./routes/index')

var app = express()

var sessionOptions = {
  secret: 'node-aws-cognito-example',
  cookie: {},
  resave: true,
  saveUninitialized: true
}

app.use(session(sessionOptions))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new OAuth2Strategy({
  authorizationURL: `https://${config.COGNITO_DOMAIN}/login`,
  tokenURL: `https://${config.COGNITO_DOMAIN}/oauth2/token`,
  clientID: config.COGNITO_APP_CLIENT_ID,
  clientSecret: config.COGNITO_APP_CLIENT_SECRET,
  callbackURL: config.COGNITO_APP_CLIENT_CALLBACK_URL
},
function (accessToken, refreshToken, profile, done) {
  let jwk = JSON.parse(config.COGNITO_JWK)
  let pem = jwkToPem(jwk)
  let payload = jwt.verify(accessToken, pem)
  let groups = payload['cognito:groups'] || []

  done(null, { groups: groups, accessToken: accessToken }) // Keep accessToken for passing to API calls
}))
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (user, done) {
  done(null, user)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
