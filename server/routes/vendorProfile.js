const express = require("express");
const router = express.Router();

const {createVendorProfile,vendorProfileCheck,updateVendorProfile,vendorProfileDetails,verifiedProfile,profileNotVerified,profileVerifyCheck,dashboardDetails} = require("../controllers/vendorProfile");
const {loginValidation,isVendor,isAdmin} = require("../middlewares/authentication");

router.post("/create-vendor-profile",loginValidation,isVendor,createVendorProfile);
router.get("/vendorProfileCheck",loginValidation,isVendor,vendorProfileCheck);
router.put("/updateVendorProfile",loginValidation,isVendor,updateVendorProfile);
router.get("/vendorProfileDetails",loginValidation,isVendor,vendorProfileDetails);
router.put("/verifiedProfile",loginValidation,isAdmin,verifiedProfile);
router.post("/profileNotVerified",loginValidation,isAdmin,profileNotVerified);
router.get("/profileVerifyCheck",loginValidation,isVendor,profileVerifyCheck);
router.get("/dashboardDetails",loginValidation,isVendor,dashboardDetails);



module.exports =  router;