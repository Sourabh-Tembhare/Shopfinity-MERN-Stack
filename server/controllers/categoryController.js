const Category = require("../models/category");
const { cloudUpload } = require("../utils/cloudinaryUploader");
const Product = require("../models/product");



//  create category
exports.createCategory = async(req,res)=>{
    try {

        // fetch data
        const {name,description} = req.body;
        const {image} = req.files;

        // validation
        if(!name|| !description  || !image){
            return res.status(400).json({
                success:false,
                message:"Please fill all the  input fields",
            })
        }

        // check is  same name  category exists or not
        const categoryExists  = await Category.findOne({name:name});

        if(categoryExists){
            return res.status(400).json({
                success:false,
                message:"A category with this name already exists",
            })
        }

        // upload image to cloudinary
        const categoryImage = await cloudUpload(image,process.env.FOLDER_NAME);

        // create category
        const newCategory = await Category.create({
            name:name,
            description:description,
            image:categoryImage.secure_url,
            imageId:categoryImage.public_id,
        });

        // return response
        return res.status(200).json({
            success:true,
            message:"Category is created successfully",
        })
       
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
        })
        
    }
}

// get all categories 
exports.getAllCategories = async(req,res)=>{
    try {

        // fetch all categories
        const allCategories = await Category.find({});

        // return response
        return res.status(200).json({
            success:true,
            message:"Succesfully fetched all categories",
            allCategories:allCategories,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
        })
          
        
    }
}

// get category page details  with top selling products , trending now products, most loved products and  best deals products of this category
exports.categoryPageDetails = async(req,res)=>{
    try {

        // fetch category Id
        const {categoryId} = req.params;

        // validation
        if(!categoryId){
            return res.status(400).json({
                success:false,
                message:"Something went wrong during fetching categoryId"
            })
        }

        // category details
        const categoryDetails = await Category.findById(categoryId);

        // Top selling products
        const topSellingProducts = await Product.find({category:categoryId}).sort({totalBuyers:-1}).populate("reviews");


        // trending now products
        const trendingNowProducts = await Product.find({category:categoryId}).sort({createdAt:-1}).populate("reviews");


        // most loved products
        const mostLovedProducts = await Product.find({category:categoryId}).sort({reviews:-1}).populate("reviews");

        // best deals product
        const bestDealProducts = await Product.find({category:categoryId}).sort({discount:-1}).populate("reviews");


        // return response
        return res.status(200).json({
            success:true,
            message:"Successfully fetched category details",
            categoryDetails:categoryDetails,
            topSellingProducts:topSellingProducts,
            trendingNowProducts:trendingNowProducts,
            mostLovedProducts:mostLovedProducts,
            bestDealProducts:bestDealProducts,
        })


        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
        })
        
    }
}