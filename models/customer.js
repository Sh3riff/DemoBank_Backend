const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
    LastName: {
        type: String,
        required: true
    },
    FirstName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    PhoneNumber: {
        type: String,
        required: true
    },
    AccountNumber: {
        type: Number
    },
    Role: {
        type: String,
        default: "customer"
    },
    AccountBalance: {
        type: mongoose.Decimal128,
        default: 0.00
    },
    CreditCard: {
        type: Object
    },
    AccountHistory: {
        type: Array
    },
    Password: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Customer', CustomerSchema)