const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type:String,
    required:true,
  },
  description: {
    type:String,
    required:true,
  },
  image:{
    type:String,
    required:true,
  },
  imageId:{
    type:String,
    required:true,
  },
  totalProducts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
  }]
 
},{timestamps:true});


module.exports = mongoose.model("Category",categorySchema)
