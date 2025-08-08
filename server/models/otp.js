const mongoose = require("mongoose");
const { mailSender } = require("../utils/mail");


const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60,
    }
});

  async function  mailsenderfunction (otp,email){
   await mailSender(email,"Shopfinity otp verification",`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Shopfinity OTP Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    .header {
      background-color: #4f46e5;
      color: #ffffff;
      text-align: center;
      padding: 25px;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
    }
    .content {
      padding: 30px 20px;
      text-align: center;
    }
    .content h2 {
      color: #333333;
      margin-bottom: 20px;
      font-size: 22px;
    }
    .otp-box {
      display: inline-block;
      background-color: #eef2ff;
      color: #4f46e5;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 6px;
      padding: 15px 30px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .note {
      font-size: 14px;
      color: #666666;
    }
    .footer {
      padding: 20px;
      text-align: center;
      background-color: #f9f9f9;
      font-size: 13px;
      color: #999999;
    }
    .footer p {
      margin: 5px 0;
    }
    @media screen and (max-width: 600px) {
      .content {
        padding: 20px 15px;
      }
      .otp-box {
        font-size: 24px;
        padding: 12px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Shopfinity</h1>
    </div>
    <div class="content">
      <h2>Your One-Time Password (OTP)</h2>
      <div class="otp-box">${otp}</div>
      <p class="note">This OTP is valid for only 5 minutes. Please do not share it with anyone for security reasons.</p>
    </div>
    <div class="footer">
      <p>Need help? Contact us at <a href="mailto:sourabhtembhare65@gmail.com">sourabhtembhare65@gmail.com</a></p>
      <p>Founder: Sourabh Tembhare</p>
      <p>&copy; 2025 Shopfinity. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`)
}

otpSchema.pre("save",async function mail (next){
    await  mailsenderfunction(this.otp,this.email)
    next();
})
module.exports = mongoose.model("OTP",otpSchema);