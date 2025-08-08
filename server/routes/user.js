const express = require("express");
const router = express.Router();

const {signupOtpSend,signUp,login,resetPasswordOtp,verifyEmailResetPassword,resetPassword,changeProfilePicture,updateUserInformation,changePassword,deleteAccount,addLocation} = require("../controllers/auth");
const {loginValidation,isCustomer} = require("../middlewares/authentication");

router.post("/send-otp",signupOtpSend);
router.post("/signUp",signUp);
router.post("/login",login);
router.post("/reset-password-otp",resetPasswordOtp);
router.post("/verifyEmailResetPassword",verifyEmailResetPassword);
router.put("/resetPassword",resetPassword);
router.put("/change-profilePicture",loginValidation,changeProfilePicture);
router.put("/updateUserInformation",loginValidation,updateUserInformation);
router.put("/changePassword",loginValidation,changePassword);
router.delete("/deleteAccount",loginValidation,isCustomer,deleteAccount);
router.put("/addLocationAndAnumber",loginValidation,addLocation);

module.exports = router;