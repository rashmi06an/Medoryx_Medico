const express = require('express');
const {
    bookAppointment,
    getDoctorAppointments,
    getPatientAppointments,
    updateAppointmentStatus,
    getLiveQueue,
    callNextPatient
} = require('./appointmentController');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.post('/', protect, bookAppointment);
router.get('/doctor', protect, getDoctorAppointments);
router.get('/patient', protect, getPatientAppointments);
router.get('/live-queue/:doctorId', getLiveQueue);
router.patch('/doctor/call-next', protect, callNextPatient);
router.patch('/:id', protect, updateAppointmentStatus);

module.exports = router;
