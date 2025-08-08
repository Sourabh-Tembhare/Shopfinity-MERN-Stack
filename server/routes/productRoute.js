const express = require("express");
const router = express.Router();

const {createProduct,updateProduct,deleteProduct,vendorAllProducts,homePageProducts,productDetails} = require("../controllers/productController");
const {loginValidation,isVendor} = require("../middlewares/authentication");

router.post("/createProduct",loginValidation,isVendor,createProduct);
router.put("/updateProduct",loginValidation,isVendor,updateProduct);
router.delete("/deleteProduct",loginValidation,isVendor,deleteProduct);
router.get("/vendorAllProducts",loginValidation,isVendor,vendorAllProducts);
router.get("/homePageProducts",homePageProducts);
router.get("/productDetails/:productId",productDetails);


module.exports = router;