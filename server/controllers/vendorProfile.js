const Vendor = require("../models/venderProfile");
const { cloudUpload } = require("../utils/cloudinaryUploader");
const { mailSender } = require("../utils/mail");
const Order = require("../models/order");
const Product = require("../models/product");

// create Vendor profile
exports.createVendorProfile = async(req,res)=>{
    try {

        // fetch data
        const {storeName,storeDescription,location} = req.body;

        const {storeLogo} = req.files;
        
        // validation
        if(!storeName || !storeDescription || !storeLogo || !location){
            return  res.status(400).json({
                success:false,
                message:"All fields is required",
            })
        }


        // fetch userId
        const userId = req.user.userId;


        if(!userId){
            return res.status(400).json({
                success:false,
                message:"Something went wrong when fetching userId",
            })
        }


        // check is already profile or not
        const profileExists = await Vendor.findOne({user:userId});

        // if find then return response 
        if(profileExists){
            return res.status(400).json({
                success:false,
                message:"Profile is already created"
            })
        }

 
        // upload store logo in a cloudinary
        const storeLogoCloud = await cloudUpload(storeLogo,process.env.FOLDER_NAME);

       // create profile
       const vendorProfile = await Vendor.create({
        user:userId,
        storeName:storeName,
        storeDescription:storeDescription,
        location:location,
        storeLogo:storeLogoCloud.secure_url,
       });

        await mailSender(req.user.email,"Shopfinity - Vendor Profile Created",`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Store Profile Created – Shopfinity</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table width="600" style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <h2 style="color: #222;">Your Store Profile Has Been Created</h2>
              </td>
            </tr>
            <tr>
              <td style="font-size: 15px; color: #333; padding-bottom: 10px;">
                <p>Hello,</p>
                <p>Your store profile has been successfully created on <strong>Shopfinity</strong>.</p>
                <p>Our admin team will verify your details shortly. Once verified, you will receive a confirmation email.</p>
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
  
       return res.status(200).json({
        success:true,
        message:"Profile created successfully",
       })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Intrenal Server error"
        })
        
    }
}


// api for check is profileAlready create 
exports.vendorProfileCheck = async(req,res)=>{
    try {

        // fetch userId
        const userId = req.user.userId;
        

        // validation
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"Something went wrong when fetching userId",
            })
        }

        // check is vendorProfile is already create or not
        const profilCreated = await Vendor.findOne({user:userId});
        
        let created;
        if(profilCreated){
       created = true;
        }
        else{
            created = false;
        }

        // return response 
        return res.status(200).json({
            success:true,
            message:"Profile validation is checked",
            created:created,
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
        })
        
    }
}


// upadte vendor profile 
exports.updateVendorProfile  = async(req,res)=>{
  try {
    // fetch data
    const {storeName,storeDescription} = req.body;

    // validation 
      if(!storeName || !storeDescription ){
      return res.status(400).json({
        success:false,
        message:"please fill all the input fields",
      })
    }


    
    // fetch userId
    const {userId} = req.user;
    
    // validation
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"Something went wrong when fetching userId",
      })
    }


    // find verndorProfile by userId if not found then return response
    const vendorProfile = await Vendor.findOne({user:userId});
    if(vendorProfile.storeName === storeName && vendorProfile.storeDescription === storeDescription && !req.files){
      return res.status(400).json({
        success:false,
        message:"No changes detected. Please update at least one field before submitting."
      })
    }

    if(!vendorProfile){
      return res.status(400).json({
        success:false,
        message:"Vendor profile not found "
      })
    }
     
    let storeLogo ;
    if(req.files){
      const  storeLogo1 =  req.files.storeLogo;
     const logo =  await cloudUpload(storeLogo1,process.env.FOLDER_NAME);
      storeLogo = logo.secure_url;
    }
    else{
      storeLogo = vendorProfile.storeLogo;
    }
    

    // upadte profile
    const updatedProfile = await Vendor.findByIdAndUpdate(vendorProfile._id,{
      storeLogo:storeLogo,
      storeDescription:storeDescription,
      storeName:storeName,
    },{new:true});

    // return response
    return res.status(200).json({
      success:true,
      message:"Profile Updated Successfully",
      updatedProfile:updatedProfile,
    })


    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
    })
    
  }
}

// get vendor profile details 
exports.vendorProfileDetails = async(req,res)=>{
  try {
    
    // fetch userId
    const {userId} = req.user;
    
    // validation
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"Something went wrong when fetching userId",
      })
    }


    // find verndorProfile by userId if not found then return response
    const vendorProfile = await Vendor.findOne({user:userId});

    if(!vendorProfile){
      return res.status(400).json({
        success:false,
        message:"Vendor profile not found "
      })
    }

    // if find then return response 
    return res.status(200).json({
      success:true,
      message:"Profile details fetched successfully",
      vendorProfileDetails:vendorProfile,
    })

    
  } catch (error) {
      console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
    })
  }
}


// verified vendor profile 
exports.verifiedProfile = async(req,res)=>{
  try {

    // fetch vendorprofileId
    const {vendorprofileId} = req.body;

    // validation
    if(!vendorprofileId){
      return res.status(400).json({
     success:false,
     message:"Something went wrong when fetching profileId" 
      })
    }

    // check is already updated or not
    const profileDetails = await Vendor.findById(vendorprofileId);

    if(profileDetails.isApproved === true){
      return res.status(400).json({
        success:false,
        message:"Profile is already verified",
      })
    }

    // upadteVendorProfile
    const updatedVendorProfile = await  Vendor.findByIdAndUpdate(vendorprofileId,{

      isApproved:true,
    },{new:true}).populate("user").exec();


    // send mail to vendor 
    await mailSender(updatedVendorProfile.user.email,"verify - Vendor Profile",`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Vendor Profile Verified</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <tr>
        <td style="padding: 20px;">
          <h2 style="color: #2e7d32;">✅ Vendor Profile Verified</h2>
          <p style="font-size: 16px; color: #333333;">
            Dear <strong>${updatedVendorProfile.user.firstName}</strong>,
          </p>
          <p style="font-size: 16px; color: #333333;">
            We are pleased to inform you that your vendor profile has been successfully <strong>verified</strong> by our admin team.
          </p>
          <p style="font-size: 16px; color: #333333;">
            You now have full access to your vendor dashboard and can start listing your products.
          </p>
          <p style="font-size: 16px; color: #333333;">
            If you have any questions or need assistance, feel free to contact us at 
            <strong>sourabhtembhare65@gmail.com</strong>.
          </p>
          <p style="font-size: 16px; color: #333333;">
            Thank you for being a part of our platform!
          </p>
          <p style="font-size: 16px; color: #333333;">
            Best regards,<br />
            <strong>Sourabh Tembhare</strong><br />
            Founder
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`)


   // return response
   return res.status(200).json({
    success:true,
    message:"Vendor Profile Verified Successfully",
   })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
    })
    
  }
}

// vendor profile  not verified for some reasons
exports.profileNotVerified = async(req,res)=>{
  try {

    // fetch data
    const {vendorEmail,reason} = req.body;

    // validation
    if(!vendorEmail || !reason){
      return res.status(400).json({
        success:false,
        message:"Something went wrong when fetching data"
      });
    }

    // send mail with reson
    await mailSender(vendorEmail,"Vendor Profile not verified",`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Vendor Profile Not Verified</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <tr>
        <td style="padding: 24px;">
          <h2 style="color: #d32f2f;">⚠️ Vendor Profile Not Verified</h2>
          <p style="font-size: 16px; color: #333;">
            We regret to inform you that your vendor profile could not be verified at this time.
          </p>
          <p style="font-size: 16px; color: #333;">
            <strong>Reason:</strong> ${reason}
          </p>
          <p style="font-size: 16px; color: #333;">
            Please review the information provided and update your profile accordingly.
          </p>
          <p style="font-size: 16px; color: #333;">
            If you have any questions or need further assistance, feel free to contact us at 
            <strong>sourabhtembhare65@gmail.com</strong>.
          </p>
          <p style="font-size: 16px; color: #333;">
            Thank you for your cooperation.
          </p>
          <p style="font-size: 16px; color: #333;">
            Best regards,<br />
            <strong>Sourabh Tembhare</strong><br />
            Founder
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`)

   //  return response 
   return  res.status(200).json({
    success:true,
    message:"mail send successfully",
   })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
    })
    
  }
}

// check is vendor profile is verified or not 
exports.profileVerifyCheck = async(req,res)=>{
  try {
    
    // fetch userId
    const userId = req.user.userId;
  
    // validation
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"Something went wrong during fetching userId",
      })
    }

    // find vendor profile
    const vendorProfile = await Vendor.findOne({user:userId});

    if(!vendorProfile){
      return  res.status(404).json({
        success:false,
        message:"Profile not found",
      })
    }

    // return response with profile is verified by admin or not 
    return res.status(200).json({
      success:true,
      message:"Successfully fetched profile details",
      verified:vendorProfile.isApproved,
    })

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal server error",
    })
    
  }
}

// vendor Dashboard details
exports.dashboardDetails = async(req,res)=>{
  try {

    // fetch userId
    const userId = req.user.userId;

    // validation
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"Something went wrong during fetching userId",
      })
    }

    //  find vendorProfile
    const vendorProfile = await Vendor.findOne({user:userId});

    if(!vendorProfile){
      return res.status(404).json({
        success:false,
        message:"Vendor profile missing or pending admin approval"
      })
    }

    // Total Sales 
    const allOrders = await Order.find({vendor:vendorProfile._id,status:"Delivered"});
    let totalSales = 0 ;
    allOrders.forEach((order) => {
      totalSales = totalSales+order.totalPrice;
    })

    // Total Orders
    const totalOrders = allOrders.length;

    // Pending Orders
    const pendingOrder = await Order.find({vendor:vendorProfile._id, status: { $nin: ["Cancelled","Delivered"] },returnStatus:false});
    const pendingOrders = pendingOrder.length;

    // total products 
    const totalProducts = await Product.find({vendor:vendorProfile._id});

    // Delivered orders
    const deliveredOrders = await Order.find({status:"Delivered"}).populate("product").exec();

    // Monthly Sales
     const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
  
   const monthlyOrders = await Order.find({
    vendor: vendorProfile._id,
    status: "Delivered",
    createdAt: { $gte: lastMonth, $lte: today }
    });

      let monthlySales = 0;
    monthlyOrders.forEach(order => {
   monthlySales += order.totalPrice;
   });

   // return response 
   return res.status(200).json({
    success:true,
    message:"Successfully fetched vendor dashboard details",
    totalSales:totalSales,
    totalOrders:totalOrders,
    pendingOrders:pendingOrders,
    totalProducts:totalProducts,
    deliveredOrders:deliveredOrders,
    monthlySales:monthlySales,
   })  
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server error",
    })
    
  }
}