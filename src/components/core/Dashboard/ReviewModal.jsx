import React, { useEffect, useState } from 'react'
import MediaPicker from '../../common/MediaPicker'
import { RxCross2 } from "react-icons/rx";
import ReactStars from 'react-stars';
import YellowUnButton from "../../common/YellowUnButton"
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const ReviewModal = ({order,setReviewModal}) => {
  const [rating,setRating] = useState(0);
  const [imageUrl,setImageUrl] = useState(null);
  const [updateImage,setUpdateImage] = useState(null);
  const [comment,setComment] = useState("");
  const {token} = useSelector((state) => state.auth);
  const [loading,setLoading] = useState(false);
  const  navigate = useNavigate();
  const [isReviewd,setIsReviewd] = useState(false);
  const {userProfile} = useSelector((state) => state.profile);
  const ratingChanged = (newRating) => {
 setRating(newRating);
}

  const submitReviewHandler = async()=>{
    const formData = new FormData();
    formData.append("productId",order?.product?._id);
    formData.append("rating",rating);
    if(comment){
      formData.append("comment",comment)
    }
    if(imageUrl){
      formData.append("image",imageUrl)
    }
    
  const toastId = toast.loading("Submitting your review. Please wait...");
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/create-review`,formData,{
        headers:{
          Authorization:'Bearer '+token,
        }
      });
      if(!response?.data?.success){
        throw new Error("Error occur during creating review");
      }
      toast.dismiss(toastId);
      toast.success(response?.data?.message);
      setReviewModal(false);
      navigate(-1);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    
  }

  const updateReviewHandler = async()=>{
    const formData = new FormData();
    formData.append("productId",order?.product?._id);
    formData.append("rating",rating);
    if(comment){
      formData.append("comment",comment)
    }
    if(imageUrl){
      formData.append("image",imageUrl)
    }
    
  const toastId = toast.loading("Updating your review. Please wait...");
  try {
    setLoading(true);
    const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/update-review`,formData,{
      headers:{
        Authorization:'Bearer '+token,
      }
    });

    if(!response?.data?.success){
      throw new Error("Error occur during updating review");
    }
    toast.dismiss(toastId);
    toast.success(response?.data?.message);
    setReviewModal(false);
    navigate(-1);
    setLoading(false);   
  } catch (error) {
    toast.dismiss(toastId);
    console.log(error);
    setLoading(false);
    toast.error(error.response?.data?.message || "Something went wrong"); 
  }
  }

  useEffect(()=>{
   const r = order?.product?.reviews.some((id) => {
          return id?.customer === userProfile?._id

   })
   setIsReviewd(r);
   if(r){
   const  data =  order?.product?.reviews.find((review) => {
      return review?.customer === userProfile?._id
    })
    setRating(data?.rating);
    if(data?.comment){
      setComment(data?.comment);
    }
    if(data?.reviewFile){
      setUpdateImage(data?.reviewFile);
    }
   }
  },[])

  console.log("Logging order",order);
  
  return (
    <div className='fixed inset-0 bg-richblack-900 bg-opacity-90 z-50 flex justify-center items-center text-richblack-5 p-4 sm:p-0'>
        <div className='bg-richblack-800 flex flex-col gap-4 rounded-md w-full sm:w-[600px] '>
         <div className='flex flex-row justify-between items-center bg-richblack-700 p-2 rounded-t-md'>
          <h2 className='text-2xl font-semibold'>
            Add Review
          </h2>
          <RxCross2 size={25} className='cursor-pointer'  onClick={()=>{setReviewModal(false)}}/>
         </div>
         <div className='flex flex-col gap-4 p-4  '>

          {/* rate product  */}
          <div className='flex flex-col gap-2 '>
            <p className='-mb-3 text-[18px]'>Rate this product</p>
         <div className='flex flex-row gap-2 items-center'>
             <ReactStars
           count={5}
           value={rating}
           onChange={ratingChanged}
           half={false}
           size={24}
            color2={'#ffd700'} />
            <p className='text-richblack-200'>
              {
                rating ===  1 && "Very Bad"
              }
                 {
                rating === 2 && "Bad"
              }
                 {
                rating === 3 && "Good"
              }
                 {
                rating === 4 && "Very Good"
              }
                 {
                rating === 5 && "Excellent"
              }
            </p>
         </div>
          </div>

          {/* review product  */}
          <div>
            <p>Review this product</p>
            <textarea value={comment} onChange={(event)=>{setComment(event.target.value)}} className='bg-transparent border-[2px] border-richblack-600  w-full px-3 py-1 outline-none h-[100px]' placeholder='Description...'></textarea>
          </div>

          {/* media picker  */}
          <MediaPicker setImageUrl={setImageUrl} updateImage={updateImage}/>

<div className='w-fit self-end'>
            {
              !loading && !isReviewd &&  <YellowUnButton text={"Submit Review"} onclickHandler={submitReviewHandler}/>
            }
            {
                !loading && isReviewd &&  <YellowUnButton text={"Update Review"} onclickHandler={updateReviewHandler}/>
            }
          </div>
         </div>
          
        </div>
    </div>
  )
}

export default ReviewModal