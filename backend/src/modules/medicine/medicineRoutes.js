const express = require('express');
const {
    addMedicine,
    getMyStock,
    searchMedicines,
    getSuggestions,
    updateMedicine,
    deleteMedicine,
    getLowStockAlerts,
    getExpiryAlerts,
    toggleMarketplace,
    getMarketplaceMedicines,
    toggleExchange,
    getExchangeMedicines,
    importInventory,
    exportInventory
} = require('./medicineController');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// Public routes to search medicines
router.get('/search', searchMedicines);
router.get('/suggestions', getSuggestions);
router.get('/marketplace', getMarketplaceMedicines);

// Pharmacy routes (Protected)
router.post('/', protect, addMedicine);
router.get('/mystock', protect, getMyStock);
router.get('/low-stock', protect, getLowStockAlerts);
router.get('/expiry-alerts', protect, getExpiryAlerts);
router.get('/exchange', protect, getExchangeMedicines);
router.post('/import', protect, importInventory);
router.get('/export', protect, exportInventory);
router.patch('/:id/marketplace', protect, toggleMarketplace);
router.patch('/:id/exchange', protect, toggleExchange);
router.put('/:id', protect, updateMedicine);
router.delete('/:id', protect, deleteMedicine);

module.exports = router;
