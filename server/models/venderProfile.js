const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    user: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "User", 
         required: true
         },
    storeName: {
      type: String,
      required: true,
    },
    storeDescription: {
      type: String,
      required: true,
    },
    storeLogo: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    location:{
      type:String,
      required:true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor",vendorSchema);
