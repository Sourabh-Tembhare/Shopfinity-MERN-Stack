const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["customer","vendor","admin"],
        required:true,
        default:"customer",
    },
    phoneNumber:{
        type:Number,
        required:true,
        unique:true,
    },
    profilePicture:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        enum:["Male","Female","Other"],
    },
    location:{
        type:String,
    },
    
},{timestamps:true})

module.exports = mongoose.model("User",userSchema);