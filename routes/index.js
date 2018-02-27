var express = require('express')
var passport = require('passport')

var router = express.Router()

router.get('/', function (req, res, next) {
  var message
  if (req.user) {
    message = `Logged in as user: ${JSON.stringify(req.user, null, 2)}`
  }
  res.render('index', { title: 'Cognito OAuth2', message: message })
})

router.get('/authenticate', passport.authenticate('oauth2'))

router.get('/callback', passport.authenticate('oauth2', { scope: ['email', 'openid', 'aws.cognito.signin.user.admin', 'profile'], failureRedirect: '/failure' }), function (req, res) {
  // Successful authentication, redirect home.
  res.redirect('/')
})

router.get('/failure', function (req, res, next) {
  return res.render('index', { title: 'Login', message: 'Failed to login!' })
})

module.exports = router
