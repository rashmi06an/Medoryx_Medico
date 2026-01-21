const express = require('express');
const {
    addMedicine,
    getMyStock,
    searchMedicines,
    updateMedicine,
    deleteMedicine
} = require('./medicineController');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// Public route to search medicines
router.get('/search', searchMedicines);

// Pharmacy routes (Protected)
router.post('/', protect, addMedicine);
router.get('/mystock', protect, getMyStock);
router.put('/:id', protect, updateMedicine);
router.delete('/:id', protect, deleteMedicine);

module.exports = router;
