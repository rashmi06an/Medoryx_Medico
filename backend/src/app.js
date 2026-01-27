const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const app = express()

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'https://medoryx-medico.vercel.app',
            process.env.FRONTEND_URL
        ].filter(Boolean); // Remove empty values

        // Allow requests with no origin (mobile apps, curl) or if origin is in allowed list
        // Also allow any Vercel preview deployments
        if (!origin ||
            allowedOrigins.includes(origin) ||
            (origin && origin.includes('.vercel.app'))) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(fileUpload())

// Health check for Render
app.get('/health', (req, res) => {
    res.status(200).send('OK')
})
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
