const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const app = express()

app.use(cors())
app.use(express.json())
app.use(fileUpload())

// Auth routes
app.use('/api/auth', require('./modules/users/routes/auth'))
// User routes
app.use('/api/users', require('./modules/users/routes/userRoutes'))
// Medicine routes
app.use('/api/medicines', require('./modules/medicine/medicineRoutes'))
// Appointment routes
app.use('/api/appointments', require('./modules/appointment/appointmentRoutes'))
// Hospital routes
app.use('/api/hospital', require('./modules/hospital/hospitalRoutes'))
// Prescription routes
app.use('/api/prescriptions', require('./modules/prescription/prescriptionRoutes'))
// Health File routes
app.use('/api/health-files', require('./modules/healthFile/healthFileRoutes'))

module.exports = app
