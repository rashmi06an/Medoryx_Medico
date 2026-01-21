const Medicine = require('./Medicine');

// @desc    Add new medicine to inventory
// @route   POST /api/medicines
// @access  Private (Pharmacy only)
exports.addMedicine = async (req, res) => {
    try {
        // Ensure user is a pharmacy (Assuming role check is done in middleware or here)
        // For now detailed role check can be added or assumed middleware does it
        // if (req.user.role !== 'pharmacy') { ... } 

        req.body.pharmacy = req.user.id; // From auth middleware

        const medicine = await Medicine.create(req.body);

        res.status(201).json({
            success: true,
            data: medicine
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// @desc    Get logged-in pharmacy's stock
// @route   GET /api/medicines/mystock
// @access  Private (Pharmacy)
exports.getMyStock = async (req, res) => {
    try {
        const medicines = await Medicine.find({ pharmacy: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: medicines.length,
            data: medicines
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Search medicines (Public/Patient)
// @route   GET /api/medicines/search
// @access  Public
exports.searchMedicines = async (req, res) => {
    try {
        const { query, location } = req.query;
        // Location param can be added later for geospatial search

        let searchCriteria = {};

        if (query) {
            searchCriteria.$text = { $search: query };
        }

        // Populate pharmacy details so patients know where to go
        const medicines = await Medicine.find(searchCriteria)
            .populate('pharmacy', 'name address phone location')
            .limit(50);

        res.status(200).json({
            success: true,
            count: medicines.length,
            data: medicines
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update medicine stock/details
// @route   PUT /api/medicines/:id
// @access  Private (Pharmacy)
exports.updateMedicine = async (req, res) => {
    try {
        let medicine = await Medicine.findById(req.params.id);

        if (!medicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }

        // specific check: Make sure user owns this medicine Record
        if (medicine.pharmacy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this medicine' });
        }

        medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: medicine
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private (Pharmacy)
exports.deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);

        if (!medicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }

        if (medicine.pharmacy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this medicine' });
        }

        await medicine.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
