const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    profileImage: {
        type: String,
        default: null
    },
    steamId: {
        type: String,
        unique: true,
        sparse: true,
        default: null
    }
});

module.exports = mongoose.model('User', UserSchema);
