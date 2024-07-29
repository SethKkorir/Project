const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique:true,
        lowercase: true
    },
    role:{
        type:String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    confirmPassword:{
        type: String,
        required: true,
    
    }
});
const Host = mongoose.model('Host', hostSchema);
module.exports = Host;
