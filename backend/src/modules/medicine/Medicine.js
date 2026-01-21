const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a medicine name'],
        trim: true,
        index: true
    },
    brand: {
        type: String,
        trim: true
    },
    category: {
        type: String, // e.g., 'Antibiotic', 'Painkiller', 'Supplement'
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    stock: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        min: 0
    },
    expiryDate: {
        type: Date,
        required: [true, 'Please add expiry date']
    },
    batchNumber: {
        type: String,
        trim: true
    },
    pharmacy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    dosageForm: {
        type: String, // e.g., 'Tablet', 'Syrup', 'Injection'
    },
    strength: {
        type: String // e.g., '500mg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for text search on name and brand
medicineSchema.index({ name: 'text', brand: 'text' });

module.exports = mongoose.model('Medicine', medicineSchema);
