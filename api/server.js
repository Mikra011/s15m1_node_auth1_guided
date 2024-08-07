const path = require('path')
const express = require('express')
const authRouter = require('./auth/auth-router.js')
const usersRouter = require('./users/users-router.js')
const session = require('express-session')
const Store = require('connect-session-knex')(session)

const server = express()

server.use(express.static(path.join(__dirname, '../client')))
server.use(express.json())
server.use(session({
  name: 'monkey',
  secret: 'keep it secret',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // if true the cookie is not set unless it's an https connection
    httpOnly: false,  // if true the cookie is not accessible through document.cookie
  },
  rolling: true, // Reset the cookie Max-Age on every request
  resave: false,  // some data stores need this set to true
  saveUninitialized: false, // privacy implications, if false no cookie is set on client unless the req.session is changed
  store: new Store({ 
    knex: require('../database/db-config.js'), // configured instance of knex
    tablename: 'sessions', // table that will store sessions inside the db, name it anything you want
    sidfieldname: 'sid', // column that will hold the session id, name it anything you want
    createtable: true, // if the table does not exist, it will create it automatically
    clearInterval: 1000 * 60 * 60, // time it takes to check for old sessions and remove them from the database to keep it clean and performant
  })
}))

server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

server.use('*', (req, res, next) => {
  next({ status: 404, message: 'not found!' })
})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server
