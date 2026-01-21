const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String }, // For pharmacy/hospital name
  address: { type: String },
  location: { // GeoJSON
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [long, lat]
  },
  pin: { type: String }, // hashed PIN
  role: { type: String, enum: ['patient', 'doctor', 'pharmacy', 'hospital'], required: true },
  otp: { type: String },
  otpExpiry: { type: Date }
}, { timestamps: true })

UserSchema.index({ location: '2dsphere' }); // For geospatial queries

// Hash PIN before saving
// Hash PIN before saving
UserSchema.pre('save', async function () {
  if (this.isModified('pin')) {
    const salt = await bcrypt.genSalt(10)
    this.pin = await bcrypt.hash(this.pin, salt)
  }
})

module.exports = mongoose.model('User', UserSchema)
