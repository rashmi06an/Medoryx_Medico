const User = require('../users/User');

// @desc    Update bed availability
// @route   PATCH /api/hospital/beds
// @access  Private (Hospital)
exports.updateBedAvailability = async (req, res) => {
    try {
        const {
            bedsTotal,
            icuAvailable,
            nicuAvailable,
            ventilatorsAvailable,
            generalBedsAvailable,
            hospitalPhone,
            city,
            area,
            googleMapsUrl
        } = req.body;

        const hospital = await User.findById(req.user.id);

        if (!hospital || hospital.role !== 'hospital') {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }

        if (bedsTotal !== undefined) hospital.bedsTotal = bedsTotal;
        if (icuAvailable !== undefined) hospital.icuAvailable = icuAvailable;
        if (nicuAvailable !== undefined) hospital.nicuAvailable = nicuAvailable;
        if (ventilatorsAvailable !== undefined) hospital.ventilatorsAvailable = ventilatorsAvailable;
        if (generalBedsAvailable !== undefined) hospital.generalBedsAvailable = generalBedsAvailable;
        if (hospitalPhone !== undefined) hospital.hospitalPhone = hospitalPhone;
        if (city !== undefined) hospital.city = city;
        if (area !== undefined) hospital.area = area;
        if (googleMapsUrl !== undefined) hospital.googleMapsUrl = googleMapsUrl;

        // Calculate total available beds
        hospital.bedsAvailable = (icuAvailable || 0) + (nicuAvailable || 0) + (ventilatorsAvailable || 0) + (generalBedsAvailable || 0);

        await hospital.save();

        res.status(200).json({
            success: true,
            data: hospital
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Search hospitals with bed availability
// @route   GET /api/hospital/search
// @access  Public
exports.searchHospitals = async (req, res) => {
    try {
        const { city, area, type } = req.query;
        let query = { role: 'hospital' };

        if (city) query.city = { $regex: city, $options: 'i' };
        if (area) query.area = { $regex: area, $options: 'i' };

        // Filtering based on bed type availability
        if (type === 'icu') query.icuAvailable = { $gt: 0 };
        else if (type === 'nicu') query.nicuAvailable = { $gt: 0 };
        else if (type === 'ventilator') query.ventilatorsAvailable = { $gt: 0 };
        else if (type === 'general') query.generalBedsAvailable = { $gt: 0 };

        const hospitals = await User.find(query).select('-pin -otp -otpExpiry');

        res.status(200).json({
            success: true,
            count: hospitals.length,
            data: hospitals
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get hospital details
// @route   GET /api/hospital/:id
// @access  Public
exports.getHospitalById = async (req, res) => {
    try {
        const hospital = await User.findById(req.params.id).select('-pin -otp -otpExpiry');
        if (!hospital || hospital.role !== 'hospital') {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }
        res.status(200).json({ success: true, data: hospital });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
