import React, { useState } from 'react'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { setLoading } from '../../redux/slices/auth';
import Spinner from '../common/Spinner';



const SignUpFrom = () => {
  const [button,setButton] = useState("customer");
  const [openEye1,setOpenEye1] = useState(true);
  const [openEye2,setOpenEye2] = useState(true);
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const [fromData,setFromData]  = useState({
    firstName:"",
    lastName:"",
    password:"",
    confirmpassword:"",
    email:"",
    phoneNumber:"",
  })
  const {loading} = useSelector((state) => state.auth)
function  changeHandler (event){
  const {name,value} = event.target;
  setFromData(prev=>{
    return {
      ...prev,
      [name]:value
    }
  })
}

const submitHandler = async(e)=>{
   e.preventDefault();
   if(fromData.password !== fromData.confirmpassword){
    toast.error("Password and confirmpassword not matched")
    return;
   }
     if(fromData.password.length < 8){
    toast.error("Use at least 8 characters for a secure password")
    return;
   }
   const specialCharRegex = /[!@#$%^&*()\[\]{}\.,\/|+=\-]/;

if (!specialCharRegex.test(fromData.password)) {
  toast.error("Password must include at least one special character (e.g., @, $, !)");
  return;
}

 if (fromData.phoneNumber.length !== 10) {
  toast.error("Please provide a valid 10-digit phone number");
  return;
}


   fromData.accountType = button;
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/send-otp`,{
      email:fromData.email
    });
     if (!response?.data?.success) {
      throw new Error("Could Not send otp")
    }
    dispatch(setLoading(false));
    toast.success(response.data.message)
    navigate("/otp",{state:{fromData:fromData}});
    
    
  } catch (error) {
    console.log(error);
     dispatch(setLoading(false));
    toast.error(error.response?.data?.message || "Something went wrong")
    
  }
}
  return (
<div>
 {
  loading ? <div className='flex items-center justify-center mt-20 '><Spinner/></div> :   <form onSubmit={submitHandler}>
     <div className='mt-2 flex flex-col gap-4 '>
      <div className='bg-richblack-700 w-fit p-1 flex gap-2 rounded-full'>
        <div onClick={()=>{
          setButton("customer");
        }} 
        className={`${button  === "customer" ? "bg-richblack-900"  : ""} rounded-full px-3 py-1 font-semibold transition-all duration-300 cursor-pointer`}
        >Buyer</div>
        <div
        onClick={()=>{
          setButton("vendor")
        }}
          className={`${button  === "vendor" ? "bg-richblack-900"  : ""} rounded-full px-3 py-1 font-semibold transition-all duration-300 cursor-pointer`}
        >Seller</div>
      </div>
      <div className='flex lg:flex-row gap-4 flex-col'>
        <div className='flex flex-col relative gap-1 text-richblack-50'>
                <label htmlFor='firstName'> 
                  First Name<sup className=' text-pink-400 '>*</sup>
                 </label>  
                 
                  <input type="text"
                   required
                   id='firstName'
                    placeholder='Enter first name'
                    name='firstName' 
               
                    value={fromData.firstName}
                    onChange={changeHandler}
                     className='bg-richblack-700 py-2 outline-none rounded-md px-2' /> 
                       
        </div>
        <div className='flex flex-col relative gap-1 text-richblack-50'>
                <label htmlFor='lastName'> 
                  Last Name<sup className=' text-pink-400' >*</sup>
                 </label>  
                
                  <input type="text" id='lastName'
                   required
                   placeholder='Enter last name'
                   value={fromData.lastName}
                   name='lastName'
                  
                   onChange={changeHandler}
                    className='bg-richblack-700 py-2 outline-none rounded-md px-2' /> 
                       
        </div>
      </div>

      <div>
           <div className='flex flex-col relative gap-1 text-richblack-50 '>
                <label htmlFor='email'> 
                 Enter email address<sup className=' text-pink-400'>*</sup>
                 </label>  
                 
                  <input type="email"
                   id='email'
                    required
                    placeholder='Enter email address'
                    value={fromData.email}
                    name='email'
                  
                    onChange={changeHandler}
                     className='bg-richblack-700 py-2 outline-none rounded-md px-2 lg:w-[474px]' /> 
                       
        </div>
      </div> 
            <div>
           <div className='flex flex-col relative gap-1 text-richblack-50 '>
                <label htmlFor='phoneNumber'> 
                 Enter Phone Number<sup className=' text-pink-400'>*</sup>
                 </label>  
                 
                  <input type="text"
                   id='phoneNumber'
                    required
                    placeholder='Enter Phone Number'
                    value={fromData.phoneNumber}
                    name='phoneNumber'
                  
                    onChange={changeHandler}
                     className='bg-richblack-700 py-2 outline-none rounded-md px-2 lg:w-[474px]' /> 
                       
        </div>
      </div> 
       <div className='flex lg:flex-row gap-4 flex-col'>
        <div className='flex flex-col relative gap-1 text-richblack-50'>
                <label htmlFor='password'> 
                  Create Password<sup className=' text-pink-400'>*</sup>
                 </label>  
                 
                  <input type={openEye1 ? "text" : "password"}
                   id='password'
                    placeholder='Enter Password' 
                     required
                    value={fromData.password}
                    name='password'
              
                    onChange={changeHandler}
                    className='bg-richblack-700 py-2 outline-none rounded-md px-2' /> 
                 {openEye1 ?  <FaRegEye onClick={()=>setOpenEye1(!openEye1)} size={23} className='absolute lg:top-9 lg:left-44 cursor-pointer right-4 top-9'/> :  <FaRegEyeSlash size={23} onClick={()=>setOpenEye1(!openEye1)} className='absolute top-9 left-44 cursor-pointer'/>}
                       
        </div>
        <div className='flex flex-col relative gap-1 text-richblack-50'>
                <label htmlFor='confirmPassword'> 
                  Confirm Password<sup className=' text-pink-400'>*</sup>
                 </label>  
               
                  <input type={openEye2 ? "text" : "password"} 
                  id='confirmPassword'
                   required 
                  placeholder='Enter Password'
                  value={fromData.confirmpassword}
                  name='confirmpassword'
             
                  onChange={changeHandler}
                   className='bg-richblack-700 py-2 outline-none rounded-md px-2' /> 
                  {openEye2 ?  <FaRegEye onClick={()=>setOpenEye2(!openEye2)} size={23} className='absolute lg:top-9 lg:left-44 right-4 top-9 cursor-pointer'/> :  <FaRegEyeSlash size={23} onClick={()=>setOpenEye2(!openEye2)} className='absolute top-9 left-44 cursor-pointer'/>}
                       
        </div>
      </div>
      <div className='relative'>
        <button type='submit'  className='text-center font-semibold text-richblack-900 bg-yellow-50 rounded-md hover:bg-yellow-100 w-full py-2 transition-all duration-300 lg:w-[474px] '>
          Create Account
        </button>
      </div>
    </div>
 </form>
 }
</div>
  )
}

export default SignUpFrom