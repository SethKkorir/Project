const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true,
        lowercae: true,
        trim:true
    }, 
    company:{
        type: String,
        required: true
    },
    whoAreYouVisiting: {
        type: String,
        required: true
    },
    reasonForVisiting: {
        type: String,
        required: true
    }
        
    
});
const User = mongoose.model('user', visitorSchema);
module.exports = user;
