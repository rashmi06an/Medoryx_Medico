const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    medicines: [{
        name: { type: String, required: true },
        dosage: { type: String }, // e.g., "500mg"
        frequency: { type: String }, // e.g., "1-0-1"
        timing: { type: String }, // e.g., "After Food"
        duration: { type: String }, // e.g., "5 days"
        reminders: { type: Boolean, default: true }
    }],
    digitizedAt: {
        type: Date,
        default: Date.now
    },
    doctorName: { type: String },
    clinicName: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);
