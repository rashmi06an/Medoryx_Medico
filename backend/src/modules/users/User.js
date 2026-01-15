const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  pin: { type: String }, // hashed PIN
  role: { type: String, enum: ['patient','doctor','pharmacy','hospital'], required: true },
  otp: { type: String },
  otpExpiry: { type: Date }
}, { timestamps: true })

// Hash PIN before saving
UserSchema.pre('save', async function(next){
  if(this.isModified('pin')){
    const salt = await bcrypt.genSalt(10)
    this.pin = await bcrypt.hash(this.pin, salt)
  }
  next()
})

module.exports = mongoose.model('User', UserSchema)
