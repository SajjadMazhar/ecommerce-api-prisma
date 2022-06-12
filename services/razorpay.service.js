const Razorpay = require("razorpay")
require("dotenv").config()
const {key_id, key_secret} = process.env
var rzp = new Razorpay({
    key_id,
    key_secret
})

module.exports = rzp