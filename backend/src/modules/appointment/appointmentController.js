const Appointment = require('./Appointment');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
exports.bookAppointment = async (req, res) => {
    try {
        const { doctor, startTime, reason } = req.body;

        // Ensure user is patient? (Role check can be added)

        // Generate token number for the doctor for today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const appointmentCount = await Appointment.countDocuments({
            doctor,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        const tokenNumber = appointmentCount + 1;

        const appointment = await Appointment.create({
            patient: req.user.id,
            doctor,
            startTime,
            reason,
            tokenNumber,
            queueStatus: 'waiting'
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
            message: err.message || 'Server Error'
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
            message: err.message || 'Server Error'
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
            message: err.message || 'Server Error'
        });
    }
};

// @desc    Get live queue status for a doctor
// @route   GET /api/appointments/live-queue/:doctorId
// @access  Public
exports.getLiveQueue = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const servingAppointment = await Appointment.findOne({
            doctor: req.params.doctorId,
            status: 'serving',
            startTime: { $gte: startOfDay, $lte: endOfDay }
        }).populate('patient', 'name');

        const waitingCount = await Appointment.countDocuments({
            doctor: req.params.doctorId,
            status: { $in: ['pending', 'confirmed'] },
            queueStatus: 'waiting',
            startTime: { $gte: startOfDay, $lte: endOfDay }
        });

        res.status(200).json({
            success: true,
            data: {
                servingToken: servingAppointment ? servingAppointment.tokenNumber : null,
                servingPatient: servingAppointment ? servingAppointment.patient?.name : null,
                waitingCount
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};

// @desc    Call next patient in queue
// @route   PATCH /api/appointments/doctor/call-next
// @access  Private (Doctor)
exports.callNextPatient = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // 1. Complete current serving appointment if any
        await Appointment.updateMany(
            { doctor: req.user.id, status: 'serving' },
            { status: 'completed', queueStatus: 'completed' }
        );

        // 2. Find next waiting appointment
        const nextInQueue = await Appointment.findOne({
            doctor: req.user.id,
            status: { $in: ['pending', 'confirmed'] },
            queueStatus: 'waiting',
            startTime: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ tokenNumber: 1 });

        if (!nextInQueue) {
            return res.status(200).json({
                success: true,
                message: 'No more patients in queue',
                data: null
            });
        }

        nextInQueue.status = 'serving';
        nextInQueue.queueStatus = 'serving';
        await nextInQueue.save();

        res.status(200).json({
            success: true,
            data: nextInQueue
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
