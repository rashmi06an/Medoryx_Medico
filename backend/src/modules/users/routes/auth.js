const express = require('express')
const router = express.Router()
const User = require('../User')
const generateOTP = require('../../../utils/generateOTP')
const client = require('../../../config/twilio')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { phone, role } = req.body
  if (!phone || !role) return res.status(400).json({ msg: 'Phone & role required' })

  let user = await User.findOne({ phone })
  if (!user) user = new User({ phone, role })

  const otp = generateOTP()
  user.otp = otp
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 min
  await user.save()

  try {
    await client.messages.create({
      body: `Your Medoryx OTP is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: phone
    })
    res.json({ msg: 'OTP sent' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Failed to send OTP' })
  }
})

// Verify OTP + set PIN
router.post('/verify-otp', async (req, res) => {
  const { phone, otp, pin } = req.body
  const user = await User.findOne({ phone })
  if (!user) return res.status(400).json({ msg: 'User not found' })

  if (user.otp !== otp || user.otpExpiry < new Date()) return res.status(400).json({ msg: 'Invalid OTP' })

  if (pin) {
    user.pin = pin
    await user.save()
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ msg: 'OTP verified', token, role: user.role })
})

// Login via PIN
router.post('/login-pin', async (req, res) => {
  const { phone, pin } = req.body
  const user = await User.findOne({ phone })
  if (!user) return res.status(400).json({ msg: 'User not found' })

  const match = await bcrypt.compare(pin, user.pin)
  if (!match) return res.status(400).json({ msg: 'Invalid PIN' })

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ msg: 'Login success', token, role: user.role })
})

// Direct Register (Simple flow without OTP for seamless onboarding)
router.post('/register', async (req, res) => {
  const { phone, pin, role, name } = req.body;
  if (!phone || !pin || !role) return res.status(400).json({ msg: 'Phone, PIN, and Role are required' });

  let user = await User.findOne({ phone });
  if (user) return res.status(400).json({ msg: 'User already exists' });

  user = new User({ phone, pin, role, name });

  // Pin hashing is handled by pre-save hook
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ msg: 'Registration success', token, role: user.role });
});

module.exports = router
