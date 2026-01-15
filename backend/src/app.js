const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// Auth routes
app.use('/api/auth', require('./modules/users/routes/auth'))

module.exports = app
