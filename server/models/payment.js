const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,

    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true,
        
    },
    vendorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vendor",
        required:true,
    }
});

module.exports = mongoose.model("Payment",PaymentSchema);