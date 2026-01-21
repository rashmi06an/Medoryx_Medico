const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// Auth routes
app.use('/api/auth', require('./modules/users/routes/auth'))
// User routes
app.use('/api/users', require('./modules/users/routes/userRoutes'))
// Medicine routes
app.use('/api/medicines', require('./modules/medicine/medicineRoutes'))
// Appointment routes
app.use('/api/appointments', require('./modules/appointment/appointmentRoutes'))

module.exports = app
