const express = require('express');
const router = express.Router();
const {
    updateBedAvailability,
    searchHospitals,
    getHospitalById
} = require('./hospitalController');
const { protect } = require('../../middleware/auth');

router.get('/search', searchHospitals);
router.patch('/beds', protect, updateBedAvailability);
router.get('/:id', getHospitalById);

module.exports = router;
