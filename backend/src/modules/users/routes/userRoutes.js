const express = require('express');
const router = express.Router();
const User = require('../User');
const { protect } = require('../../../middleware/auth');

// @desc    Get all doctors
// @route   GET /api/users/doctors
// @access  Private (Patient)
router.get('/doctors', protect, async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('name phone email');
        res.json({ success: true, count: doctors.length, data: doctors });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
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
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
