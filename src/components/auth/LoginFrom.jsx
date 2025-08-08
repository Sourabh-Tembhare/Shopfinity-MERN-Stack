import React, { useState } from 'react'
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../common/Spinner';
import { setLoading, setToken } from '../../redux/slices/auth';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setProfile } from '../../redux/slices/profile';


const LoginFrom = () => {
  const [fromData, setFromData] = useState({
    email: "",
    password: "",
  })
  const [openEye1, setOpenEye1] = useState(true);
  const {loading} = useSelector((state) => state.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function changeHandler(event) {
    const { name, value } = event.target;
    setFromData(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }
    
  const submitHandler = async(e)=>{
    e.preventDefault();
   try {
        dispatch(setLoading(true));
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`,fromData);
     if (!response?.data?.success) {
      throw new Error("Error occured during login")
    }
    dispatch(setToken(response.data.token))
    dispatch(setProfile(response.data.user));
    dispatch(setLoading(false));
    toast.success(response.data.message)
    navigate("/");
    
   } catch (error) {
        console.log(error);
     dispatch(setLoading(false));
    toast.error(error.response?.data?.message || "Something went wrong")
   }
  }
  return (
    <div>
     {
      loading ? <div className='flex items-center justify-center mt-24'><Spinner/></div> :  <form  onSubmit={submitHandler} className='flex flex-col gap-4' >
        <div className='flex flex-col relative gap-1 text-richblack-50'>
          <label htmlFor='email'>
            Enter email address <sup className='text-pink-400'>*</sup>
          </label>
          
          <input type="email"
            id='email'
            required
            placeholder='Enter email address'
            value={fromData.email}
            name='email'

            onChange={changeHandler}
            className='bg-richblack-700 py-2 outline-none rounded-md px-2' />

        </div>
        <div className='flex flex-col relative gap-1 text-richblack-50'>
          <label htmlFor='password'>
            Password <sup className='text-pink-400'>*</sup>
          </label>
          
          <input type={openEye1 ? "text" : "password"}
            id='password'
            placeholder='Enter Password'
            required
            value={fromData.password}
            name='password'

            onChange={changeHandler}
            className='bg-richblack-700 py-2 outline-none rounded-md px-2' />
          {openEye1 ? <FaRegEye onClick={() => setOpenEye1(!openEye1)} size={23} className='absolute top-9 right-4 cursor-pointer' /> : <FaRegEyeSlash size={23} onClick={() => setOpenEye1(!openEye1)} className='absolute top-9 right-4 cursor-pointer' />}
          <Link to={"/forgot-password"} className='text-blue-200 self-end ml-80 text-[12px] italic'> <p>Forgot password</p></Link>
        </div>
        <div className='relative'>
          <button type='submit' className='text-center font-semibold text-richblack-900 bg-yellow-50 rounded-md hover:bg-yellow-100 w-full py-2 transition-all duration-300'>
            Sign in
          </button>
        </div>
      </form>
     }

    </div>
  )
}

export default LoginFrom