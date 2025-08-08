const Product = require("../models/product");
const Vendor = require("../models/venderProfile");
const Category = require("../models/category");
const { cloudUpload, deleteFile } = require("../utils/cloudinaryUploader");
const Review = require("../models/review")

// create product
exports.createProduct = async (req, res) => {
  try {
    // fetch data from body
    const { name, description, categoryId, price, tag, stock ,discount } = req.body;
    const { image } = req.files;

    // validation
    if (
      !name ||
      !description ||
      !categoryId ||
      !image ||
      !price ||
      !tag ||
      !stock ||
      !discount
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the input fields",
      });
    }

    // Parse tag if it's sent as JSON string
    let parsedTag = tag;
    if (typeof tag === "string") {
      try {
        parsedTag = JSON.parse(tag);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid tag format. It must be a valid JSON array or an array.",
        });
      }
    }

    if (!Array.isArray(parsedTag)) {
      return res.status(400).json({
        success: false,
        message: "Tag must be an array",
      });
    }

    // get userId from auth middleware
    const userId = req.user.userId;

    // fetch vendor profile
    const profile = await Vendor.findOne({ user: userId });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile does not exist",
      });
    }

    if (!profile.isApproved) {
      return res.status(400).json({
        success: false,
        message: "Your profile is not verified by admin",
      });
    }

    // check is category exists
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // upload image to cloudinary
    const productImage = await cloudUpload(image, process.env.FOLDER_NAME);

    // create product
    const newProduct = await Product.create({
      category: categoryId,
      image: productImage.secure_url,
      name,
      description,
      tag: parsedTag,
      price,
      stock,
      vendor: profile._id,
      imageId: productImage.public_id,
      discount:discount
    });

    // add this product in category
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, {
      $push: { totalProducts: newProduct._id },
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "Product uploaded successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log("Error while creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// update product details
exports.updateProduct = async (req, res) => {
  try {
    // fetch data from body
    const { name, description, price, tag, stock, productId ,categoryId,discount} = req.body;

    // validation
    if (!name || !description || !productId || !price || !tag || !stock || !categoryId || !discount) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the input fields",
      });
    }

    // Parse tag if it's sent as JSON string
    let parsedTag = tag;
    if (typeof tag === "string") {
      try {
        parsedTag = JSON.parse(tag);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid tag format. It must be a valid JSON array or an array.",
        });
      }
    }

    if (!Array.isArray(parsedTag)) {
      return res.status(400).json({
        success: false,
        message: "Tag must be an array",
      });
    }

    // get userId from auth middleware
    const userId = req.user.userId;

    // fetch vendor profile
    const profile = await Vendor.findOne({ user: userId });

    //  check is this product is created by this vendor or not
    const product = await Product.findById(productId);

    if (String(product.vendor) !== String(profile._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this product.",
      });
    }

    // imageUrl logic
    let imageUrl;
    let imageId;
    if (req.files) {
      const { image } = req.files;

      // upload image to cloudinary
      const imageUpload = await cloudUpload(image, process.env.FOLDER_NAME);
      imageUrl = imageUpload.secure_url;
      imageId = imageUpload.public_id;

      // delete old image  from cloudinary
      await deleteFile(product.imageId);
    } else {
      imageUrl = product.image;
      imageId = product.imageId;
    }

    // old category Id 
    const oldCategoryId = product.category;

    // upadte product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name: name,
        description: description,
        tag: parsedTag,
        image: imageUrl,
        stock: stock,
        price: price,
        imageId: imageId,
        category:categoryId,
        discount:discount
      },
      { new: true }
    );

    if(String(oldCategoryId) !== String(categoryId)){

      // remove product Id from old category 
      const updatedCategory = await Category.findByIdAndUpdate(oldCategoryId,{
        $pull:{totalProducts:updatedProduct._id}
      });
      
      // add product id in new category
      const newCategoryUpdated = await Category.findByIdAndUpdate(categoryId,{
        $push:{totalProducts:updatedProduct._id}
      })
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

// delete product
exports.deleteProduct = async (req, res) => {
  try {
    // fetch product Id
    const { productId, categoryId } = req.body;

    // validation
    if (!productId || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong during fetching id's",
      });
    }

    // userId from request
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong during fetching userId",
      });
    }

    // check is this product is  craeted by this user or not
    const vendorProfile = await Vendor.findOne({ user: userId });

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (String(vendorProfile._id) !== String(product.vendor)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this product",
      });
    }

    // delete product
    const deleteProduct = await Product.findByIdAndDelete(productId);

    // delete image from cloudinary
    await deleteFile(product.imageId);

    // remove productId from categorySchema
    const updateCategory = await Category.findByIdAndUpdate(categoryId, {
      $pull: { totalProducts: productId },
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "Product deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

// vendor all products
exports.vendorAllProducts = async (req, res) => {
  try {
    
    // fetch userId from request
    const userId = req.user.userId;

    // validation
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong during fetching userId",
      });
    }

    // by userId fetch profileId and then by profileId fetch all product of vendor
    const profile = await Vendor.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile missing or pending admin approval",
      });
    }

    const allProducts = await Product.find({ vendor: profile._id });

    // return response
    return res.status(200).json({
      success: true,
      message: "Successfully fetched all products",
      allProducts: allProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};


// products for home page
exports.homePageProducts = async(req,res)=>{
  try {

    // Top Deals of the day
    const topDeals = await Product.find({stock:{$gte:1}}).sort({discount:-1}).limit(10).populate("reviews");

    // New launches
    const newLaunches = await Product.find({stock:{$gte:1}}).sort({createdAt:-1}).limit(10).populate("reviews");

    // Top Rated Products
    const topRated = await Product.find({stock:{$gte:1}}).sort({reviews:-1}).limit(10).populate("reviews");

    // deals under 999
    const dealsUnder  = await Product.find({stock:{$gte:1},price:{$lte:999}}).sort({reviews:-1}).limit(10).populate("reviews");

    // return response 
    return res.status(200).json({
      success:true,
      message:"Products fetched successfully",
      topDeals:topDeals,
      newLaunches:newLaunches,
      topRated:topRated,
      dealsUnder:dealsUnder,
    })
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
    })
    
  }
}

// productDetails
exports.productDetails = async(req,res)=>{
  try {

    // fetch productId
    const productId = req.params.productId;

    // validation
    if(!productId){
      return res.status(400).json({
        success:false,
        message:"Something went wrong during fetching productId"
      })
    }
   
  // product details
  const productDetails = await Product.findById(productId).populate("vendor").populate({
    path:"reviews",
    populate:{
      path:"customer"
    }
  }).populate("category").exec();

  if(!productDetails){
    return res.status(404).json({
      success:false,
      message:"Product details not found"
    })
  }

// similar 10 products
const similarProducts = await Product.find({category:productDetails.category,price:{$lte:productDetails.price},_id:{$ne:productDetails._id}}).sort({totalBuyers:-1}).limit(10);

return res.status(200).json({
  success:true,
  message:"Products details fetched successfully",
  productDetails:productDetails,
  similarProducts:similarProducts,
})
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error"
    })
    
  }
}