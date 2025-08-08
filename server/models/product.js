const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type:String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    tag:{
      type:[String],
      required:true,
    },
    totalBuyers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reviews: [
      { type: mongoose.Schema.Types.ObjectId,
         ref: "Review"
         }
        ],
        stock:{
          type:Number,
          required:true,
        },
        imageId:{
        type:String,
        required:true,
        },
        discount:{
          type:Number,
          required:true,
        }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
