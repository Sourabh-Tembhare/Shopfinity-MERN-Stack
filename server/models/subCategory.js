const mongoose = require("mongoose");


const subCategorySchema = new  mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true,
    },
    subCategoryName:{
        type:String,
        required:true,
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    }]
    
})

module.exports = mongoose.model("SubCategory",subCategorySchema);