const Medicine = require('./Medicine');
const User = require('../users/User');

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
        console.error('Error adding medicine:', err);
        res.status(400).json({
            success: false,
            message: err.message || 'Error adding medicine'
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
            message: err.message || 'Server Error'
        });
    }
};

// @desc    Search medicines (Public/Patient)
// @route   GET /api/medicines/search
// @access  Public
exports.searchMedicines = async (req, res) => {
    try {
        const { query, lat, lng } = req.query;
        let searchCriteria = {};

        if (query) {
            searchCriteria.name = { $regex: query, $options: 'i' };
        }

        let medicines;
        if (lat && lng) {
            // Find pharmacies near the coordinates using aggregation for distance
            const pharmacies = await User.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        },
                        distanceField: 'distance', // in meters
                        maxDistance: 50000, // 50km radius
                        query: { role: 'pharmacy' },
                        spherical: true
                    }
                },
                {
                    $project: { _id: 1, distance: 1 }
                }
            ]);

            const pharmacyDistances = {};
            pharmacies.forEach(p => {
                pharmacyDistances[p._id.toString()] = p.distance;
            });

            const pharmacyIds = pharmacies.map(p => p._id);
            searchCriteria.pharmacy = { $in: pharmacyIds };

            const rawMedicines = await Medicine.find(searchCriteria)
                .populate('pharmacy', 'name address phone location googleMapsUrl')
                .limit(50);

            // Add distance to each medicine result
            medicines = rawMedicines.map(m => {
                const med = m.toObject();
                if (med.pharmacy && med.pharmacy._id) {
                    med.distance = pharmacyDistances[med.pharmacy._id.toString()];
                }
                return med;
            });

            // Sort by distance
            medicines.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        } else {
            medicines = await Medicine.find(searchCriteria)
                .populate('pharmacy', 'name address phone location googleMapsUrl')
                .limit(50);
        }

        res.status(200).json({
            success: true,
            count: medicines.length,
            data: medicines
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
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
            message: err.message || 'Server Error'
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
            message: err.message || 'Server Error'
        });
    }
};

// @desc    Get medicine suggestions (Public/Patient)
// @route   GET /api/medicines/suggestions
// @access  Public
exports.getSuggestions = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Case-insensitive search starting with the query
        const suggestions = await Medicine.find({
            name: { $regex: new RegExp(`^${query}`, 'i') }
        })
            .distinct('name'); // Get unique names

        res.status(200).json({
            success: true,
            data: suggestions.slice(0, 10) // Limit to top 10
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};

// @desc    Get medicines with low stock (threshold < 10)
// @route   GET /api/medicines/low-stock
// @access  Private (Pharmacy)
exports.getLowStockAlerts = async (req, res) => {
    try {
        const medicines = await Medicine.find({
            pharmacy: req.user.id,
            stock: { $lt: 10 }
        }).sort({ stock: 1 });

        res.status(200).json({
            success: true,
            count: medicines.length,
            data: medicines
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};

// @desc    Get medicines expiring within 60 days
// @route   GET /api/medicines/expiry-alerts
// @access  Private (Pharmacy)
exports.getExpiryAlerts = async (req, res) => {
    try {
        const sixtyDaysFromNow = new Date();
        const now = new Date();
        sixtyDaysFromNow.setDate(now.getDate() + 60);

        const medicines = await Medicine.find({
            pharmacy: req.user.id,
            expiryDate: { $lte: sixtyDaysFromNow, $gt: now }
        }).sort({ expiryDate: 1 });

        res.status(200).json({
            success: true,
            count: medicines.length,
            data: medicines
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};

// @desc    Get already expired medicines
// @route   GET /api/medicines/expired-alerts
// @access  Private (Pharmacy)
exports.getExpiredAlerts = async (req, res) => {
    try {
        const now = new Date();

        const medicines = await Medicine.find({
            pharmacy: req.user.id,
            expiryDate: { $lte: now }
        }).sort({ expiryDate: -1 });

        res.status(200).json({
            success: true,
            count: medicines.length,
            data: medicines
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};

// @desc    List/Unlist medicine on discounted marketplace
// @route   PATCH /api/medicines/:id/marketplace
// @access  Private (Pharmacy)
exports.toggleMarketplace = async (req, res) => {
    try {
        const { isOnMarketplace, discountPrice } = req.body;
        const medicine = await Medicine.findById(req.params.id);

        if (!medicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }

        if (medicine.pharmacy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        medicine.isOnMarketplace = isOnMarketplace;
        if (discountPrice !== undefined) medicine.discountPrice = discountPrice;

        await medicine.save();

        res.status(200).json({
            success: true,
            data: medicine
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};

// @desc    Get all marketplace medicines (Public/Patient)
// @route   GET /api/medicines/marketplace
// @access  Public
exports.getMarketplaceMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find({ isOnMarketplace: true })
            .populate('pharmacy', 'name address location googleMapsUrl')
            .sort({ expiryDate: 1 });

        res.status(200).json({
            success: true,
            count: medicines.length,
            data: medicines
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};

// @desc    List/Unlist medicine for P2P exchange
// @route   PATCH /api/medicines/:id/exchange
// @access  Private (Pharmacy)
exports.toggleExchange = async (req, res) => {
    try {
        const { onExchange } = req.body;
        const medicine = await Medicine.findById(req.params.id);

        if (!medicine) {
            return res.status(404).json({ success: false, message: 'Medicine not found' });
        }

        if (medicine.pharmacy.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        medicine.onExchange = onExchange;
        await medicine.save();

        res.status(200).json({
            success: true,
            data: medicine
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};

// @desc    Get all exchange-ready medicines (Private/Pharmacy)
// @route   GET /api/medicines/exchange
// @access  Private (Pharmacy)
exports.getExchangeMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find({
            onExchange: true,
            pharmacy: { $ne: req.user.id }
        })
            .populate('pharmacy', 'name address phone')
            .sort({ expiryDate: 1 });

        res.status(200).json({
            success: true,
            count: medicines.length,
            data: medicines
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};

const XLSX = require('xlsx');

// @desc    Import inventory from Excel
// @route   POST /api/medicines/import
// @access  Private (Pharmacy)
exports.importInventory = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const file = req.files.file;
        const workbook = XLSX.read(file.data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const medicinesToImport = data.map(item => ({
            name: item.Name,
            brand: item.Brand,
            category: item.Category,
            price: item.Price,
            stock: item.Stock,
            expiryDate: item.ExpiryDate ? new Date(item.ExpiryDate) : undefined,
            batchNumber: item.BatchNumber,
            pharmacy: req.user.id,
            dosageForm: item.DosageForm,
            strength: item.Strength
        }));

        await Medicine.insertMany(medicinesToImport);

        res.status(200).json({
            success: true,
            message: `${medicinesToImport.length} medicines imported successfully`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error or Invalid File Format'
        });
    }
};

// @desc    Export inventory to Excel
// @route   GET /api/medicines/export
// @access  Private (Pharmacy)
exports.exportInventory = async (req, res) => {
    try {
        const medicines = await Medicine.find({ pharmacy: req.user.id });

        const data = medicines.map(m => ({
            Name: m.name,
            Brand: m.brand,
            Category: m.category,
            Price: m.price,
            Stock: m.stock,
            ExpiryDate: m.expiryDate ? m.expiryDate.toISOString().split('T')[0] : 'N/A',
            BatchNumber: m.batchNumber,
            DosageForm: m.dosageForm,
            Strength: m.strength
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=inventory.xlsx');
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
};
