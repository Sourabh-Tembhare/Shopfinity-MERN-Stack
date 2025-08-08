import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import YellowUnButton from "../common/YellowUnButton";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

const ResetPassword = ({email,setLoading,setStep}) => {
   
  const [formData, setFormData] = useState({
    newPassword: "",
    newConfirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if(formData.newPassword.length < 1 || formData.newConfirmPassword.length < 1){
       toast.error("please please the input fields");
       return;
    }

    if (formData.newPassword !== formData.newConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
        if(formData.newPassword.length < 8){
    toast.error("Use at least 8 characters for a secure password")
    return;
   }
    const specialCharRegex = /[!@#$%^&*()\[\]{}\.,\/|+=\-]/;

if (!specialCharRegex.test(formData.newPassword)) {
  toast.error("Password must include at least one special character (e.g., @, $, !)");
  return;
}
    const data = {...formData,email}
    try {
        setLoading(true);
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/resetPassword`,data);
        if(!response?.data?.success){
            throw new Error("Error occur during updating password");
        }
        toast.success(response?.data?.message);
        setLoading(false);
        setStep(1);
        navigate("/login");    
    } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(error.response?.data?.message || "Something went wrong");
         }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-66px)] px-4">
      <div className="w-full max-w-md bg-richblack-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl text-white font-bold text-center mb-6">
          Reset Password
        </h2>

        <form className="flex flex-col gap-4">
       
          <label className="relative">
            <span className="text-sm text-richblack-5">New Password<sup className="text-pink-400">*</sup></span>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              required
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full mt-1 p-2 rounded-md bg-richblack-700 text-white border border-richblack-600 outline-none pr-10"
            />
            <span
              className="absolute right-3 top-[38px] text-xl cursor-pointer text-richblack-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ?  <FaRegEye /> : <FaRegEyeSlash /> }
            </span>
          </label>

        
          <label className="relative">
            <span className="text-sm text-richblack-5">Confirm Password<sup className="text-pink-400">*</sup></span>
            <input
              type={showConfirm ? "text" : "password"}
              name="newConfirmPassword"
              required
              value={formData.newConfirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full mt-1 p-2 rounded-md bg-richblack-700 text-white border border-richblack-600 outline-none pr-10"
            />
            <span
              className="absolute right-3 top-[38px] text-xl cursor-pointer text-richblack-300"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ?  <FaRegEye />  : <FaRegEyeSlash />}
            </span>
          </label>

          <YellowUnButton text="Reset Password" onclickHandler={handleSubmit} />
        </form>

        <div className="mt-4 text-center text-sm text-blue-400 hover:underline">
          <Link to="/login" className="flex items-center justify-center gap-1">
            <MdOutlineKeyboardBackspace size={18} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
