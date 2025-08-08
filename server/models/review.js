const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'Product',
     required:true,
    },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required:true,
},
  rating: { 
    type: Number,
    required:true,
    },
  comment: {
    type:String,
  },
  vendorProfileId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vendor",
    required:true,
  },
  reviewFile:{
    type:String,
  },
  reviewFileId:{
    type:String,
  }

},{timestamps:true});


module.exports = mongoose.model("Review",reviewSchema);
