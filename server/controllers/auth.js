const User = require("../models/user");
const OTP = require("../models/otp");
const optGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cloudUpload } = require("../utils/cloudinaryUploader");
const { mailSender } = require("../utils/mail");
const Review = require("../models/review");

// email send before opt save  in dataBase for signup veriification
exports.signupOtpSend = async (req, res) => {
  try {
    // fetch email
    const { email } = req.body;

    // validation
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong when fetching email",
      });
    }

    // check is user is  already exists
    const user = await User.findOne({ email: email });

    // if entry find then return response
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    // generate otp
    const otp = optGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // save entry in DB
    const otpEntry = await OTP.create({
      email: email,
      otp: otp,
    });

    // return respose
    return res.status(200).json({
      success: true,
      message: "Otp send successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// signUp
exports.signUp = async (req, res) => {
  try {
 
    
    // fetch data
    const {
      firstName,
      lastName,
      email,
      password,
      accountType,
      phoneNumber,
      otp,
    } = req.body;

 
    
    //validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !accountType ||
      !phoneNumber ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields is required",
      });
    }
     
 
    
    // check if user is already exists or not
    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }
       
    const existingPhone = await User.findOne({ phoneNumber });
  if (existingPhone) {
  return res.status(400).json({
    success: false,
    message: "Phone number already in use",
    });
  }



    // verify otp
    const dbOtp = await OTP.find({ email: email })
      .sort({ createdAt: -1 })
      .limit(1);

 
    if (dbOtp.length === 0) {
      return res.status(404).json({
        success: false,
        message: "otp not found",
      });
    }
   
    

   if (String(dbOtp[0].otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Otp not matched",
      });
    }

    // hash password
    let hashPassword ;
    try {
       hashPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: "something went wrong when hashing password",
      });
    }

    // generate profile picture by firstName and last Name 
    const profilePicture = `https://api.dicebear.com/8.x/initials/svg?seed=${firstName}+${lastName}`

    // create entry in DB 
    const newUser = await User.create({
     firstName,
      lastName,
      email,
      password:hashPassword,
      accountType,
      phoneNumber,
      profilePicture
    });

    // return response 
    res.status(200).json({
        success:true,
        message:"Signup Successfully",

    })



  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// login
exports.login = async(req,res)=>{
    try {

        // fetch email and password 
        const {email,password} = req.body;

        // validation
        if(!email || !password){
            return  res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }

        // check is email registered or not
        const user = await User.findOne({email:email});

        if(!user){
               return  res.status(400).json({
                success:false,
                message:"Email not registered",
            })
        }

        // match old password and new password
       const match = await bcrypt.compare(password,user.password);
       if(!match){
                return  res.status(400).json({
                success:false,
                message:"Password not matched",
            })
       }

       //  create payload for  token
       const payload = {
        userId:user._id,
        email:user.email,
        accountType:user.accountType,
       }

       // create token
       const token = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"1y"
       });
       
   
    
       user.password = undefined;

       // return res
       return res.status(200).json({
        success:true,
        message:"Login Successfully",
        user:user,
        token:token,
       })
        

    } catch (error) {
     console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    }
}

// email for reset password
exports.resetPasswordOtp = async (req, res) => {
  try {
    // fetch email
    const {email} = req.body;

    // validation
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Something went wrong when fetching email",
      });
    }

    // check is user is  exists or not
    const user = await User.findOne({ email: email });

    // if entry not find then return response
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // generate otp
    const otp = optGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // save entry in DB
    const otpEntry = await OTP.create({
      email: email,
      otp: otp,
    });

    // return respose
    return res.status(200).json({
      success: true,
      message: "Otp send successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// verify email for reset password
exports.verifyEmailResetPassword = async(req,res)=>{
  try {

    // fetch data
    const {otp,email} = req.body;

    // valiadtion
    if(!otp){
      return res.status(400).json({
        success:false,
        message:"Please fiil the input field"
      })
    }

    
        if(!email){
      return res.status(400).json({
        success:false,
        message:"Something went wrong when fetching email"
      })
    }


    // find the latest otp
    const otpEntry = await OTP.findOne({email:email}).sort({createdAt:-1});

    if(!otpEntry){
         return res.status(400).json({
        success:false,
        message:"otp entry not found"
      })
    }

    // comapre otp
    if(String(otpEntry.otp) !== String(otp)){
      return res.status(400).json({
        success:false,
        message:"Otp not matched",
      })
    }

    res.status(200).json({
      success:true,
      message:"Otp matched Successfully",
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success:false,
      message:"Internal Server error"
    })
    
  }
}

// reset the password
exports.resetPassword = async(req,res)=>{
  try {
    // fetch data
    console.log("hii");
    
    const {newPassword,newConfirmPassword,email} = req.body;

    
    
    // validation
    if(!newPassword || !newConfirmPassword){
      return res.status(400).json({
        success:false,
        message:"Please fill the input field"
      })
    }

        if(!email){
      return res.status(400).json({
        success:false,
        message:"Something when wrong when fetching email"
      })
    }
    
    

    // match both
    if(newPassword !== newConfirmPassword){
         return res.status(400).json({
        success:false,
        message:"password and confirm password not matched"
      })
    }

    // hash the password
    const hashPassword = await bcrypt.hash(newPassword,10);

    // update the password
    const updatedUser = await User.findOneAndUpdate({email:email},{
      password:hashPassword,
    },{new:true})
    

    // return response
    return res.status(200).json({
      success:true,
      message:"Password updated successfully",
    })

    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success:false,
      message:"Internal Server error"
    })
  }
}

// profile picture change
exports.changeProfilePicture = async(req,res)=>{
 try{
  // fetch image
  const {image} = req.files;
  
  // validation
  if(!image){
    return res.status(400).json({
      success:false,
      message:"Please select the image",
    })
  }

  // fetch user Id from request
  const userId = req.user.userId;

  // upload image in cloudinary
  const profileImageUpload = await cloudUpload(image,process.env.FOLDER_NAME);

  // update user
  const updatedUser = await User.findByIdAndUpdate(userId,{
    profilePicture:profileImageUpload.secure_url,
  },{new:true})

  // return response
  return res.status(200).json({
    success:true,
    message:"Profile updated Successfully",
    updatedUser,

  })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success:false,
      message:"Internal Server error"
    })

  }
}

// update userInformation
exports.updateUserInformation = async(req,res)=>{
  try {

    // fetch information
    const {firstName,lastName,gender,phoneNumber} = req.body;

    // validation
    if(!firstName || !lastName || !gender || !phoneNumber){
      return res.status(400).json({
        success:false,
        message:"Please fill all the input fields",
      })
    }

    // find userId from request
    const userId = req.user.userId;
        if(!userId){
        return res.status(400).json({
        success:false,
        message:"Something went wrong when fetching userId",
      })
    }

    const userInformation = await User.find({});
    const otherallUsers = userInformation.filter((user) => user._id.toString() !== userId)

    if(otherallUsers.some((user) => user.phoneNumber === Number(phoneNumber))){
        return res.status(400).json({
        success:false,
        message:"Phone Number is already in use",
      })
    }

    // update information
    const updatedUser = await User.findByIdAndUpdate(userId,{
      firstName:firstName,
      lastName:lastName,
      phoneNumber:phoneNumber,
      gender:gender,
    },{new:true})

    // return response

    return res.status(200).json({
      success:true,
      message:"Profile Information updated successfully",
      updatedUser:updatedUser,
    })
    
  } catch (error) {
    console.log(error);
     return res.status(500).json({
      success:false,
      message:"Internal Server Error",
    })
    
  }
}


// password change
exports.changePassword = async(req,res)=>{
  try {

    // fetch oldPassword  and newPassword
    const {oldPassword,password} = req.body;

    // validation
    if(!oldPassword || !password){
      return res.status(400).json({
        success:false,
        message:"Please fill all the input fields"
      })
    }

    // find userId
    const userId =  req.user.userId;


    const userDetails = await User.findById(userId);



    // match old password
    if(await bcrypt.compare(oldPassword,userDetails.password)){
     
 const isSame = await bcrypt.compare(password, userDetails.password);
if (isSame) {
    return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password"
    });
}

      // hash the password
      const newPassword  = await bcrypt.hash(password,10);

      // update user
      const updatedUser = await User.findByIdAndUpdate(userId,{
        password:newPassword,
      },{new:true})

      // return response
      return res.status(200).json({
        success:true,
        message:"Password updated Successfully",
      })
    }
    else{
       return res.status(400).json({
        success:false,
        message:"OldPassword is incorrect"
      })

    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
    success:false,
    message:"Internal  Server error"
      })
  }
}

// delete account
exports.deleteAccount = async(req,res)=>{
  try {

    // fetch user id 
    const userId = req.user.userId;

    // delete all review of this user
      await Review.deleteMany({ customer: userId });
      
    // delete user
    const user = await User.findByIdAndDelete(userId);

    await mailSender(req.user.email,"Shopfinity Account delete",`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Account Deletion Request</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table width="600" style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <h2 style="color: #222;">Shopfinity – Account Deletion Request</h2>
              </td>
            </tr>
            <tr>
              <td style="font-size: 15px; color: #333; padding-bottom: 10px;">
                <p><strong>User Email:</strong> ${req.user.email}</p>
              </td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #666; padding-top: 10px;">
                <p>If you have any questions, contact us at  
                  <a href="mailto:sourabhtembhare65@gmail.com" style="color: #e3342f;">
                    sourabhtembhare65@gmail.com
                  </a>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #666; padding-top: 10px;">
                <p>– Sourabh Tembhare, Founder of Shopfinity</p>
              </td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #aaa; text-align: center; padding-top: 30px;">
                &copy; 2025 Shopfinity. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`)

    // return response
    return res.status(200).json({
      success:true,
      message:"Account deleted Successfully",
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error",
    })
    
  }
}

// during buy a product add location 
exports.addLocation = async(req,res)=>{
  try {
    // fetch data
    const {location} = req.body;

    // validation
    if(!location){
      return res.status(400).json({
        success:false,
        message:"Please fill the location field",
      })
    }

    const userId = req.user.userId;
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"Something went wrong during fetching userId"
      })
    }

    // update userProfile
    const updatedUser = await User.findByIdAndUpdate(userId,{
      location:location,
    },{new:true})

    // set password to undefined 
    updatedUser.password = undefined ;

    // return response
    return res.status(200).json({
      success:true,
      message:"Location updated successfully",
      updatedUser:updatedUser,
    })


    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error"
    })
    
  }
}

