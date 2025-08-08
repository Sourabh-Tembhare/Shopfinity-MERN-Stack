import React, { useEffect, useState } from 'react'
import { RiImageAddLine } from "react-icons/ri";
import { ImCancelCircle } from "react-icons/im";

const MediaPicker = ({setImageUrl,updateImage}) => {
const [selectedImageUrl,setSelectedImageUrl] = useState(null);
  const imageHandler = (e)=>{
    setImageUrl(e.target.files[0]);
   setSelectedImageUrl(URL.createObjectURL(e.target.files[0]))
  };
  const cancelImageHandler = ()=>{
    setSelectedImageUrl(null);
    setImageUrl(null);
  }
  const setupdateImage = ()=>{
    if(updateImage !== null){
      setSelectedImageUrl(updateImage);
    }
  }
  useEffect(()=>{
    setupdateImage();
  },[updateImage])
  return (
    <>
    <form>
    <div className='relative'>
          <label  >
         <p>   Select Media File<sup className='text-pink-400'>*</sup></p>
         <div className='bg-richblack-700 relative py-8 border-[1px] border-dashed border-richblack-400 rounded-md text-richblack-200 flex flex-col justify-center items-center gap-2'>
            <RiImageAddLine size={30}/>
           <div className='flex flex-col justify-center items-center'> <p>Drop files here or </p> <span className='text-blue-100 cursor-pointer'>click to upload</span></div>
           <p>File size must be below 10MB</p>
          
             {
          selectedImageUrl && <img src={selectedImageUrl} loading='lazy' alt="selectedImage" className='absolute top-6 w-[80%] h-[80%] object-contain'/>
        }
    
         </div>
          <input type="file" className='hidden' onChange={imageHandler}/>
        
        </label>
               {
        selectedImageUrl &&  <ImCancelCircle className='absolute md:left-4 left-1 md:top-10 top-8 cursor-pointer' size={25} onClick={cancelImageHandler}/>
       }
    </div>
   
    </form>
    </>
  )
}

export default MediaPicker