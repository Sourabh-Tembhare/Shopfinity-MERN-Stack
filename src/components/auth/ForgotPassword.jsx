import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import YellowUnButton from "../common/YellowUnButton";
import ResetPassword from "./ResetPassword";
import PinInput from "react-pin-input";
import { AiOutlineRedo } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import Spinner from "../common/Spinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); 
  const [otp, setOtp] = useState("");
  const [loading,setLoading] = useState(false);

  const handleReset =async (e) => {
    e.preventDefault();
    if(!email){
        toast.error("Please fill the input field");
        return;
    }
    if(otp){
        setOtp("");
    }
    try {
        setLoading(true);
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/reset-password-otp`,{email});
        if(!response?.data?.success){
            throw new Error("Error occur durind sending email");
        }
        toast.success(response?.data?.message);
        setStep(2);
        setLoading(false);
    } catch (error) {
        setLoading(false);
        console.log(error);
        toast.error(error?.response?.data?.message || "Something went wrong")
        
    }  
  };

  const otpVerifyHandler = async(req,res)=>{
    if(otp.length < 4){
        toast.error("please fill the otp");
        return ;
    }
    try {
        setLoading(true);
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/verifyEmailResetPassword`,{
            email:email,
            otp:otp
        })
        if(!response?.data?.success){
            throw new Error("Error occur during verify otp")
        }
        toast.success(response?.data?.message);
        setLoading(false);
        setStep(3);
        
    } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(error?.response?.data?.message || "Something went wrong");
        
    }
  }
  return (
<>
{
    loading ? <div className="h-[calc(100vh-66px)] flex items-center justify-center"><Spinner/></div> :     <div>
      {step === 1 && 
        <div className="flex justify-center items-center min-h-[calc(100vh-66px)] px-4">
          <div className="w-full max-w-md bg-richblack-800 rounded-lg p-6 sm:p-10 shadow-md">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Forgot Password
            </h2>

            <form  className="flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-richblack-5 text-sm">
               <p> Email Address<sup className="text-pink-400">*</sup></p>
                <input
                required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-md bg-richblack-700 text-white outline-none placeholder:text-richblack-400"
                />
              </label>

              <YellowUnButton text="Reset Password" onclickHandler={handleReset}/>
            </form>

            <div className="text-center mt-6 text-sm text-blue-400 hover:underline">
              <Link to="/login" className="flex items-center justify-center gap-1">
                <MdOutlineKeyboardBackspace size={18} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
}  
       {
        step === 3 && <ResetPassword email={email} setLoading={setLoading} setStep={setStep} />
       } 
       {
         step === 2 &&  <div className="flex flex-col items-center justify-center min-h-[calc(100vh-66px)] px-4">
 
      <div className="flex flex-col items-center gap-6 bg-richblack-800 px-4 py-8 sm:px-6 md:px-10 lg:px-16 rounded-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white text-center">Enter OTP</h2>

        <div className="w-full overflow-x-auto">
          <div className="flex justify-center min-w-[220px] sm:min-w-0">
            <PinInput
              length={4}
              type="numeric"
              inputMode="number"
              onChange={(value) => setOtp(value)}
              inputStyle={{
                backgroundColor: "#1f2937", 
                border: "1px solid #4b5563", 
                color: "#fff",
                borderRadius: "8px",
                width: "42px",
                height: "52px",
                fontSize: "18px",
                margin: "0 5px",
                textAlign: "center",
              }}
              containerStyle={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "nowrap",     
              }}
            />
          </div>
        </div>

        <div className="w-full">
          <YellowUnButton text={"Verify and Continue"} onclickHandler={otpVerifyHandler} />
        </div>
      </div>

    
      <div className="flex justify-between items-center w-full max-w-md mt-6 px-4 text-sm text-richblack-5">
        <Link to="/login" className="flex items-center gap-1 hover:text-yellow-50">
          <MdOutlineKeyboardBackspace size={18} />
          <span>Back to login</span>
        </Link>
        <button className="flex items-center gap-1 text-blue-400 hover:underline" onClick={handleReset}  >
          <AiOutlineRedo size={18} />
          <span>Resend it</span>
        </button>
      </div>
    </div>
       }
      
    </div>
}
</>
  );
};

export default ForgotPassword;
