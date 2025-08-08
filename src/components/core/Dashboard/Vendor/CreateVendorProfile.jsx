import React, { useState } from "react";
import LocationSelector from "../../../common/LocationSelector";
import MediaPicker from "../../../common/MediaPicker";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

const CreateVendorProfile = ({vendorProfileCheck,setLoading}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const {token} = useSelector((state) => state.auth);
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: "",
  });
  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
  });

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
    if (!location.address) {
      toast.error("Please enter the address of your shop.");
      return ;
    }

    if (!imageUrl) {
      toast.error("Please upload a store image.");
      return ;
    }

    const data = new FormData();
    data.append("storeName", formData.storeName);
    data.append("storeDescription", formData.storeDescription);
    data.append("location", location.address);
    data.append("storeLogo", imageUrl);

    try {
     setLoading(true);
     const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/create-vendor-profile`,data,{
      headers:{
        Authorization:'Bearer '+token,
      }
     })

     if(!response?.data?.success){
      throw new Error("Error occur during creating vendor profile");
     }

     toast.success(response.data?.message);
     setLoading(false);
     vendorProfileCheck();

      
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      
    }

  };
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold">Create Vendor Profile</h2>
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
        <LocationSelector onChange={setLocation} />
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
          <MediaPicker setImageUrl={setImageUrl} />
        </div>
        <button
          type="submit"
          className="bg-yellow-200 px-6 py-2 font-semibold text-richblack-900 hover:bg-yellow-300 rounded-md transition-all duration-300 cursor-pointer  flex justify-center items-center"
        >
          Create Profile
        </button>
      </form>
    </div>
  );
};

export default CreateVendorProfile;
