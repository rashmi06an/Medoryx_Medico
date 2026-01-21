const HealthFile = require('./HealthFile');

// @desc    Upload health file
// @route   POST /api/health-files
exports.uploadHealthFile = async (req, res) => {
    try {
        const {
            familyMember,
            fileName,
            fileUrl,
            fileType,
            doctorName,
            specialty,
            date,
            followUpDate,
            notes
        } = req.body;

        const healthFile = await HealthFile.create({
            patient: req.user.id, // from auth middleware
            familyMember,
            fileName,
            fileUrl,
            fileType,
            doctorName,
            specialty,
            date,
            followUpDate,
            notes
        });

        res.status(201).json({
            success: true,
            data: healthFile
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get patient's health files
// @route   GET /api/health-files
exports.getMyHealthFiles = async (req, res) => {
    try {
        const { familyMember, fileType, specialty } = req.query;

        let query = { patient: req.user.id };

        if (familyMember) query.familyMember = familyMember;
        if (fileType) query.fileType = fileType;
        if (specialty) query.specialty = specialty;

        const files = await HealthFile.find(query).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: files.length,
            data: files
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete health file
// @route   DELETE /api/health-files/:id
exports.deleteHealthFile = async (req, res) => {
    try {
        const file = await HealthFile.findById(req.params.id);

        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        if (file.patient.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await file.remove();

        res.status(200).json({
            success: true,
            message: 'File removed'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update health file metadata
// @route   PATCH /api/health-files/:id
exports.updateHealthFile = async (req, res) => {
    try {
        let file = await HealthFile.findById(req.params.id);

        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        if (file.patient.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        file = await HealthFile.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: file
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
