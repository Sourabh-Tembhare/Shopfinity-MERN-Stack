const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to check if user is logged in
exports.loginValidation = async (req, res, next) => {
  try {
    const isToken = req.headers.authorization;


    if (!isToken || !isToken.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing or malformed",
      });
    }

    const token = isToken.split(" ")[1];

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.user = decoded;

    next(); 
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


// check isCustomer
exports.isCustomer = async(req,res,next)=>{
  try {
    if(req.user.accountType !== "customer"){
      return res.status(400).json({
        success:false,
        message:"This is protected route for customer"
      })
    }
    next();
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
    })
    
  }
}

// check isVendor
exports.isVendor = async(req,res,next)=>{
  try {
    if(req.user.accountType !== "vendor"){
      return res.status(400).json({
        success:false,
        message:"This is protected route for customer"
      })
    }
    next();
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
    })
    
  }
}

// check isAdmin
exports.isAdmin = async(req,res,next)=>{
  try {
    if(req.user.accountType !== "admin"){
      return res.status(400).json({
        success:false,
        message:"This is protected route for admin",
      })
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error"
    })
    
  }
}

