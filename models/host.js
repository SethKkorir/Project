const mongoose = require('mongoose');
//THis imports Mongoose library that will be used for interacting with Mongodb
const hostSchema = new mongoose.Schema({ // this schema will define how the documents will be stored in database
    idNumber:{
        type:String,
        required: true,
    },
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
    },
    sessionActive: { 
        type: Boolean,
        default: false, // Default to false as no session is active initially
    },
    status:{
        
    }
});
const Host = mongoose.model('Host', hostSchema); // this will created mongoose model that will serve as a constructot for creating new documnents in database
module.exports = Host;
// just export this model so that i will use other part of my application.