const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vendor: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "Vendor",
     required: true,
     },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  productPrice: {
    type: Number,
    required: true,
  },
  quantity:{
  type:Number,
  required:true,
  },
  totalPrice:{
   type:Number,
   required:true,
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  paymentId:{
    type:String,
  },
  returnStatus:{
    type:Boolean,
    default:false,
  }
},{timestamps:true});


module.exports = mongoose.model("Order",orderSchema);
