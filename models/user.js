const mongoose = require('mongoose');

// Visitor Schema
const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    company: {
        type: String,
        required: true
    },
    whoAreYouVisiting: {
        type: String,
        required: true
    },
    purposeOfVisiting: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', visitorSchema);
module.exports = User;