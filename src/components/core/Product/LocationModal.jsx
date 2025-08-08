import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '../../../redux/slices/profile';

const LocationModal = ({setLoactionModal}) => {
    const [location,setLocation] = useState("");
    const {userProfile} = useSelector((state) => state.profile);
    const [loading,setLoading] = useState(false);
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(()=>{
      if(userProfile?.location){
        setLocation(userProfile?.location);
      }
    },[])

    const submitHandler = async(e)=>{
        e.preventDefault();
        if(userProfile?.location === location){
           toast.error("No changes detected");
           return ;
        }
        try {
            setLoading(true);
            var toastId = toast.loading("Updating location...");
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/addLocationAndAnumber`,{location},{
                headers:{
                    Authorization:'Bearer '+token,
                }
            })
            if(!response?.data?.success){
                throw new Error("Error occur during updating location");
            }
            dispatch(setProfile(response?.data?.updatedUser));
            toast.dismiss(toastId);
            toast.success(response?.data?.message);
            setLoactionModal(false);
            setLoading(false);  
        } catch (error) {
        setLoading(false);
        toast.dismiss(toastId);
        toast.error(error.response?.data?.message || "Something went wrong");
        console.log(error);
        
        }
    }
  return (
    <div className='fixed inset-0 bg-richblack-900 bg-opacity-90 z-50 flex justify-center items-center text-richblack-5 '>
      <div className='bg-richblack-800 rounded-md p-4 flex flex-col gap-4 w-[90%] sm:w-[560px]'>
        <div className='flex justify-between items-center '>
                <h2 className='font-semibold text-xl'>Location Information</h2>
              <RxCross2 size={25} onClick={()=>{setLoactionModal(false)}} className='cursor-pointer'/>
              </div>
              <form className='flex flex-col gap-4' onSubmit={submitHandler}>
                <label className='flex flex-col'>
                    <p>Location<sup className='text-pink-400'>*</sup></p>
                    <input 
                    required
                    onChange={(event)=>{setLocation(event.target.value)}}
                    value={location}
                    type="text"
                     placeholder='Street, city, state, and postal code'
                      className='rounded-md bg-richblack-700 w-full  py-2 px-4 outline-none'
                       />
                </label>
                <div className='flex gap-2 flex-row self-end'>
                   <button type='button' disabled={loading} onClick={()=>{setLoactionModal(false)}} className='px-6 py-2 font-semibold bg-richblack-900  border-richblack-700 text-richblack-5 hover:bg-richblack-800 rounded-md transition-all duration-300 flex items-center justify-center  '>Cancel</button>
                   <button type='submit' disabled={loading} className='bg-yellow-200 px-6 py-2 font-semibold text-richblack-900 hover:bg-yellow-300 rounded-md transition-all duration-300 cursor-pointer  flex justify-center items-center'>Save</button>
                </div>
              </form>

      </div>
    </div>
  )
}

export default LocationModal