const Review = require("../models/review");
const Product = require("../models/product");
const { cloudUpload, deleteFile } = require("../utils/cloudinaryUploader");


// create review
exports.createReview = async(req,res)=>{
try {
    // fetch data
    const {productId,rating,comment=""} = req.body;

    // validation
    if(!productId || !rating){
        return res.status(400).json({
            success:false,
            message:"Insufficient data to create review",
        })
    }

    const userId = req.user.userId;

    if(!userId){
    return res.status(400).json({
    success:false,
    message:"Something went wrong during fetching userId",
    })
    }

    // check user buy this product or not
    const productDetails = await Product.findById(productId);

    if(!productDetails){
        return res.status(400).json({
            success:false,
            message:"Product not found",
        })
    }

    if(!productDetails.totalBuyers.includes(userId)){
        return res.status(403).json({
        success:false,
        message:"You cannot submit a review because you have not purchased this product",
        })
    }

    // check is review is alredy created or not 
    const reviewExist = await Review.findOne({product:productId,customer:userId});

    if(reviewExist){
        return res.status(400).json({
            success:false,
            message:"Review is allready created now you can only update it",
        })
    }
    
    let imageUrl = null;
    let imageId = null;
    if(req.files){
        const {image} = req.files;
        const imageUpload  = await cloudUpload(image,process.env.FOLDER_NAME);
        imageUrl = imageUpload.secure_url;
        imageId = imageUpload.public_id;
    }

    // create review
    const newReview = await Review.create({
        product:productId,
        customer:userId,
        rating:rating,
        comment:comment,
        vendorProfileId:productDetails.vendor,
        reviewFile:imageUrl,
        reviewFileId:imageId,
    });

    // update product
    const updatedProduct = await Product.findByIdAndUpdate(productId,{
        $push:{reviews:newReview._id}
    })

    // return response
    return res.status(200).json({
        success:true,
        message:"Thank you so much. Your review has been saved",
    })

    
} catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Internal Server error"
    })
    
}
}

// update review 
exports.updateReview = async(req,res)=>{
    try {
        // fetch data
    const {productId,rating,comment=""} = req.body;

    // validation
    if(!productId || !rating){
        return res.status(400).json({
            success:false,
            message:"Insufficient data to update review",
        })
    }

    const userId = req.user.userId;

    if(!userId){
    return res.status(400).json({
    success:false,
    message:"Something went wrong during fetching userId",
    })
    }

    // check user buy this product or not
    const productDetails = await Product.findById(productId);

    if(!productDetails){
        return res.status(400).json({
            success:false,
            message:"Product not found",
        })
    }

    if(!productDetails.totalBuyers.includes(userId)){
        return res.status(403).json({
        success:false,
        message:"You cannot submit a review because you have not purchased this product",
        })
    }

    // check is review exist
    const review = await Review.findOne({product:productId,customer:userId})

    if(!review){
        return res.status(404).json({
            success:false,
            message:"Review not found",
        })
    }

    let imageUrl;
    let imageId;

    if(req.files){
        const imageUpload = await cloudUpload(req.files.image,process.env.FOLDER_NAME);
         
       if(review.reviewFileId !== null){
         // delete old  product image
        await deleteFile(review.reviewFileId)
       }
         
        imageUrl = imageUpload.secure_url;
        imageId = imageUpload.public_id;
    }
    else{
        imageUrl = review.reviewFile;
        imageId = review.reviewFileId;
    }

    // update review 
    const updatedReview = await Review.findByIdAndUpdate(review._id,{
        rating:rating,
        comment:comment,
        reviewFile:imageUrl,
        reviewFileId:imageId,  
    },{new:true})

    // return response 
    return res.status(200).json({
        success:true,
        message:"Thank you so much. Your review has been saved",
    })} catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
        })
        
    }
}

// get product reviews
exports.getProductReviews = async (req,res)=>{
    try {

        // fetch productId
        const {productId} = req.params;
        
        // validation
        if(!productId){
            return res.status(400).json({
                success:false,
                message:"Something went wrong during fetching productId"
            })
        }

        // find all reviews with this productId
        const allReviews = await Review.find({product:productId}).sort({rating:-1}).populate("customer").exec();

        // return response
        return res.status(200).json({
            success:true,
            message:"Successfully find all reviews",
            allReviews:allReviews,
        })      
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
        })    
    }
}