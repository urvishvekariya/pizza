const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone');
const dateIndia = moment.tz(Date.now(), "asia/kolkata");

const orderSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: { type: Object, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    paymentType: { type: String, default: 'COD' },
    paymentStatus: { type: Boolean, default: false },
    status: { type: String, default: 'order_placed' },
    createdAt: { type: Date, default: dateIndia },
    updatedAt: { type: Date, default: dateIndia }
})

module.exports = mongoose.model('Order', orderSchema);