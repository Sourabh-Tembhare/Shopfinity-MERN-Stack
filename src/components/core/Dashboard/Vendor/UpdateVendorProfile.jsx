import React, { useEffect, useState } from "react";
import LocationSelector from "../../../common/LocationSelector";
import MediaPicker from "../../../common/MediaPicker";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import Spinner from "../../../common/Spinner";

const UpdateVendorProfile = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const {token} = useSelector((state) => state.auth);
  const [loading,setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [updateImage,setUpdateImage] = useState(null);
  const [verifiled,setVerified] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
  });

  const fetchProfileDetails =  async()=>{
    try {
      setLoading(true);
      const respose =  await axios.get(`${process.env.REACT_APP_BASE_URL}/vendorProfileDetails`,{
        headers:{
          Authorization:'Bearer '+token,
        }
      })
      if(!respose?.data?.success){
        throw new Error("Error occur during fetchingVendorProfileDetails");
      }
      formData.storeName = respose.data.vendorProfileDetails.storeName;
      formData.storeDescription =  respose.data.vendorProfileDetails.storeDescription;
      setLocation(respose.data.vendorProfileDetails.location);
      setUpdateImage(respose.data.vendorProfileDetails.storeLogo);
      setVerified(respose.data.vendorProfileDetails.isApproved);
         setLoading(false);
      
      
    } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
            
    }
  }


  useEffect(()=>{
    fetchProfileDetails();
  },[])
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const submitHandler = async (e) => {
    e.preventDefault();


    const data = new FormData();
    data.append("storeName", formData.storeName);
    data.append("storeDescription", formData.storeDescription);
    
    if(imageUrl){
    data.append("storeLogo", imageUrl);
    }


    try {
      setLoading(true);
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/updateVendorProfile`,data,{
        headers:{
          Authorization:'Bearer '+token,
        }
      });
      if(!response?.data?.success){
        throw new Error("Error occur during upadting vendor profile");
      }
      toast.success(response.data?.message);
      setLoading(false);
      setImageUrl(null);
      fetchProfileDetails();

    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      
    }

  };
  return (
   <>
   {
    loading ? <div className='h-[calc(100vh-136px)] flex items-center justify-center'><Spinner/></div> :     <div className="flex flex-col gap-6">
   
        <h2 className="text-3xl font-bold">Update Vendor Profile</h2>
      
    
   <div className="overflow-hidden whitespace-nowrap bg-yellow-100 border-b border-yellow-400 py-2">
  <p className="inline-block text-yellow-800 font-semibold animate-scroll-left">
    📍 Your shop location has already been set. Further updates to the location are not allowed for security reasons.
  </p>
</div>
  <div>
          {
            verifiled ?
             <p className="text-xl  font-semibold text-caribbeangreen-200">Your profile has been successfully verified by the admin. You now have full access to all features</p>
             :  <p className="text-pink-200 text-xl  font-semibold">Your profile has not been verified by the admin. Please wait for approval or contact <a className="text-blue-200 underline" href="mailto:sourabhtembhare65@gmail.com">support</a> for assistance</p>
          }
        </div>

      <form
        className="flex flex-col gap-4 bg-richblack-800 rounded-md p-4"
        onSubmit={submitHandler}
      >
        <p className="text-xl font-semibold">Profile Information</p>
        <label className="flex flex-col w-full">
          <p>
            Store Name<sup className="text-pink-400">*</sup>
          </p>
          <input
            type="text"
            required
            value={formData.storeName}
            name="storeName"
            onChange={onChangeHandler}
            className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md w-full"
            placeholder="Enter your store name"
          />
        </label>
               <label className="flex flex-col w-full">
          <p>
            Location<sup className="text-pink-400">*</sup>
          </p>
          <input
            type="text"
            disabled
            value={location}
        
      
            className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md w-full"
           
          />
        </label>
        <label>
          <p>
            Store Description<sup className="text-pink-400">*</sup>
          </p>
          <textarea
            value={formData.storeDescription}
            name="storeDescription"
            onChange={onChangeHandler}
            required
            rows={6}
            cols={30}
            className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md w-full"
            placeholder="Write a short description about your store..."
          ></textarea>
        </label>
        <div>
          <p>Store Logo</p>
          <MediaPicker setImageUrl={setImageUrl} updateImage={updateImage}/>
        </div>
        <button
        disabled={loading}
          type="submit"
          className="bg-yellow-200 px-6 py-2 font-semibold text-richblack-900 hover:bg-yellow-300 rounded-md transition-all duration-300 cursor-pointer  flex justify-center items-center"
        >
          Update Profile
        </button>
      </form>
    </div>
   }
   </>
  );
};

export default UpdateVendorProfile;
