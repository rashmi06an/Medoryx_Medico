const Twilio = require('twilio')
require('dotenv').config()

const client = Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
module.exports = client
