const express = require('express');
const router = express.Router();
const User = require('../User');
const Appointment = require('../../appointment/Appointment');
const { protect } = require('../../../middleware/auth');

// @desc    Get all doctors with filters
// @route   GET /api/users/doctors
// @access  Private (Patient)
router.get('/doctors', protect, async (req, res) => {
    try {
        const { name, specialization, sort } = req.query;
        let query = { role: 'doctor' };

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        if (specialization) {
            query.specialization = specialization;
        }

        let doctors = User.find(query).select('name email specialization department experience rating availableTimings address');

        if (sort) {
            const sortBy = sort.split(',').join(' ');
            doctors = doctors.sort(sortBy);
        } else {
            doctors = doctors.sort('-rating'); // Default sort by rating
        }

        const medicalExperts = await doctors;
        res.json({ success: true, count: medicalExperts.length, data: medicalExperts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
});

// @desc    Search for patients
// @route   GET /api/users/patients
// @access  Private (Doctor)
router.get('/patients', protect, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ success: false, message: 'Only doctors can search patients' });
        }
        const { query } = req.query;
        let searchCriteria = { role: 'patient' };
        if (query) {
            searchCriteria.$or = [
                { name: { $regex: query, $options: 'i' } },
                { phone: { $regex: query, $options: 'i' } }
            ];
        }
        const patients = await User.find(searchCriteria).select('name phone email').limit(20);
        res.json({ success: true, count: patients.length, data: patients });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
});

// @desc    Get patients associated with the logged-in doctor
// @route   GET /api/users/doctor/my-patients
// @access  Private (Doctor)
router.get('/doctor/my-patients', protect, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ success: false, message: 'Only doctors can access this route' });
        }

        // Find unique patient IDs from appointments with this doctor
        const patientIds = await Appointment.distinct('patient', { doctor: req.user.id });

        const patients = await User.find({ _id: { $in: patientIds } }).select('name phone email address');

        res.json({ success: true, count: patients.length, data: patients });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
});

// @desc    Update hospital stats
// @route   PATCH /api/users/hospital-stats
// @access  Private (Hospital)
router.patch('/hospital-stats', protect, async (req, res) => {
    try {
        if (req.user.role !== 'hospital') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }
        const { bedsTotal, bedsAvailable, icuAvailable } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, {
            bedsTotal,
            bedsAvailable,
            icuAvailable
        }, { new: true });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
});

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
router.patch('/profile', protect, async (req, res) => {
    try {
        const { name, address, googleMapsUrl } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, {
            name,
            address,
            googleMapsUrl
        }, { new: true });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
});

module.exports = router;
