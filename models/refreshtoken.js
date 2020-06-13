const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    AccountNumber: {
        type: Number,
        required: true
    },
    Token: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('RefreshToken', UserSchema)