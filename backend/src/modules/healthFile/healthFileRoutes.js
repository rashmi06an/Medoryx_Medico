const express = require('express');
const router = express.Router();
const {
    uploadHealthFile,
    getMyHealthFiles,
    deleteHealthFile,
    updateHealthFile
} = require('./healthFileController');
const { protect } = require('../../middleware/auth');

router.post('/', protect, uploadHealthFile);
router.get('/', protect, getMyHealthFiles);
router.delete('/:id', protect, deleteHealthFile);
router.patch('/:id', protect, updateHealthFile);

module.exports = router;
