import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Spinner from '../../../common/Spinner';
import UpdateVendorProfile from './UpdateVendorProfile';
import CreateVendorProfile from './CreateVendorProfile';
import { useSelector } from 'react-redux';

const VendorProfileSettings = () => {
    const [vendorProfile,setVendorProfile] = useState(false);
    const [loading,setLoading] = useState(false);
      const { token } = useSelector((state) => state.auth);

    const vendorProfileCheck = async()=>{
        try {
           setLoading(true);
           const response =  await  axios.get(`${process.env.REACT_APP_BASE_URL}/vendorProfileCheck`,{
            headers:{
                Authorization:'Bearer '+token
            }
           });
           if(!response?.data?.success){
            throw new Error("Something went when vendorProfileCheck api call")
           }
           setVendorProfile(response.data.created);
           setLoading(false);
            
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");       
        }
    }
    
      useEffect(()=>{
           vendorProfileCheck() ;
        },[])
  return (
    <div>
        {
            loading ? <div className='h-[calc(100vh-136px)] flex items-center justify-center'><Spinner/></div> : <div>
                {
                    vendorProfile ? <UpdateVendorProfile/> : <CreateVendorProfile vendorProfileCheck={vendorProfileCheck} setLoading={setLoading}/>
                }
            </div>
        }
    </div>
  )
}

export default VendorProfileSettings