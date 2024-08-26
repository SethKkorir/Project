const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
    },
    lastName:{
        type:String,
        required: true,
    },
    surName:{
        type:String,
    },
    mobileNumber:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique:true,
        lowercase: true
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
const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
