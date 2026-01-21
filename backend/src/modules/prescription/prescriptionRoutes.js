const express = require('express');
const router = express.Router();
const {
    savePrescription,
    getMyPrescriptions,
    getPrescriptionById
} = require('./prescriptionController');
const { protect } = require('../../middleware/auth');

router.post('/', protect, savePrescription);
router.get('/patient', protect, getMyPrescriptions);
router.get('/:id', protect, getPrescriptionById);

module.exports = router;
