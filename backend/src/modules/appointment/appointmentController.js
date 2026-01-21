const Appointment = require('./Appointment');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
exports.bookAppointment = async (req, res) => {
    try {
        const { doctor, startTime, reason } = req.body;

        // Ensure user is patient? (Role check can be added)

        const appointment = await Appointment.create({
            patient: req.user.id,
            doctor,
            startTime,
            reason
        });

        res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Get doctor's appointments
// @route   GET /api/appointments/doctor
// @access  Private (Doctor)
exports.getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user.id })
            .populate('patient', 'name phone')
            .sort({ startTime: 1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get patient's appointments
// @route   GET /api/appointments/patient
// @access  Private (Patient)
exports.getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id })
            .populate('doctor', 'name phone')
            .sort({ startTime: 1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id
// @access  Private (Doctor/Patient)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Authorization check
        if (appointment.doctor.toString() !== req.user.id && appointment.patient.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
