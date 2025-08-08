import React, { useState } from "react";
import PinInput from "react-pin-input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { AiOutlineRedo } from "react-icons/ai";
import YellowUnButton from "../common/YellowUnButton";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/auth";
import axios from "axios";
import toast from "react-hot-toast";
import Spinner from "../common/Spinner";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const data = location.state.fromData;
    const {loading} = useSelector((state) => state.auth)
      const dispatch = useDispatch();
      const navigate = useNavigate();

  const resendOtpHandler = async()=>{
      try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/send-otp`,{
      email:data.email
    });
   if (!response?.data?.success) {
      throw new Error("Could Not send otp")
    }
    dispatch(setLoading(false));
    toast.success(response.data.message)
  } catch (error) {
    console.log(error);
     dispatch(setLoading(false));
    toast.error(error.response?.data?.message || "Something went wrong")
    
  }
  }

  const signUpHandler = async()=>{
      if(otp.length < 4){
        toast.error("please fill the otp");
        return ;
    }
    const formData = {...data,otp}
    try {
      dispatch(setLoading(true));
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signUp`,formData);
      if(!response?.data?.success){
        throw new Error("Error occur during signup")
      }
      toast.success(response?.data?.message);
      dispatch(setLoading(false));
      navigate("/login");
      
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      
      
    }
  }


  return (
  <div>
    {
      loading ? <div className="flex items-center justify-center h-[calc(100vh-66px)]"><Spinner/></div> :   <div className="flex flex-col items-center justify-center min-h-[calc(100vh-66px)] px-4">
 
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
          <YellowUnButton text={"Verify and Register"} onclickHandler={signUpHandler} />
        </div>
      </div>

    
      <div className="flex justify-between items-center w-full max-w-md mt-6 px-4 text-sm text-richblack-5">
        <Link to="/login" className="flex items-center gap-1 hover:text-yellow-50">
          <MdOutlineKeyboardBackspace size={18} />
          <span>Back to login</span>
        </Link>
        <button className="flex items-center gap-1 text-blue-400 hover:underline" onClick={resendOtpHandler}  >
          <AiOutlineRedo size={18} />
          <span>Resend it</span>
        </button>
      </div>
    </div>
    }
  </div>
  );
};

export default Otp;
