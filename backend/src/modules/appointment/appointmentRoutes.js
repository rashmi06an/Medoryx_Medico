const express = require('express');
const {
    bookAppointment,
    getDoctorAppointments,
    getPatientAppointments,
    updateAppointmentStatus
} = require('./appointmentController');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.post('/', protect, bookAppointment);
router.get('/doctor', protect, getDoctorAppointments);
router.get('/patient', protect, getPatientAppointments);
router.patch('/:id', protect, updateAppointmentStatus);

module.exports = router;
