const mongoose = require('mongoose');
const { ref } = require('pdfkit');

// Visitor Schema
const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role:{
        type: String
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
    purposeOfVisiting: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['waiting', 'approved'],
        default: 'waiting'
    },
    hostId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Host',
        required: true
    }
  
});


const User = mongoose.model('User', visitorSchema);
module.exports = User;
