const Prescription = require('./Prescription');

// @desc    Save digitized prescription
// @route   POST /api/prescriptions
// @access  Private (Patient)
exports.savePrescription = async (req, res) => {
    try {
        const { imageUrl, medicines, doctorName, clinicName } = req.body;

        const prescription = await Prescription.create({
            patient: req.user.id,
            imageUrl,
            medicines,
            doctorName,
            clinicName
        });

        res.status(201).json({
            success: true,
            data: prescription
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get patient's digitized prescriptions
// @route   GET /api/prescriptions/patient
// @access  Private (Patient)
exports.getMyPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
exports.getPrescriptionById = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);

        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }

        // Check if it belongs to the patient or if user is a doctor
        if (prescription.patient.toString() !== req.user.id && req.user.role !== 'doctor') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({
            success: true,
            data: prescription
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
