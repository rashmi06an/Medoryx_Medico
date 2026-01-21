const mongoose = require('mongoose');

const HealthFileSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    familyMember: {
        type: String,
        default: 'Self' // Can be 'Self', 'Spouse', 'Child', 'Parent', etc.
    },
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['Report', 'Scan', 'Prescription', 'Other'],
        default: 'Report'
    },
    doctorName: {
        type: String
    },
    specialty: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    followUpDate: {
        type: Date
    },
    notes: {
        type: String
    },
    isEncrypted: {
        type: Boolean,
        default: true // Logical flag for the demo
    }
}, { timestamps: true });

module.exports = mongoose.model('HealthFile', HealthFileSchema);
