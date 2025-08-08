import React, { useState } from 'react'
import { IoMdArrowDropdown } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import { CiLogout } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { removeToken } from '../../../redux/slices/auth';
import { removeProfile } from '../../../redux/slices/profile';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../common/ConfirmationModal';

const ProfileDropDown = () => {
  const [toggle,setToggle] = useState(false);
  const [confirmToggle,setConfirmToggle] = useState(false);
  const {userProfile} = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleHandler = ()=>{
  setToggle(prev => setToggle(!prev))
  }

  const logOutHandler = ()=>{
    navigate("/login");
   dispatch(removeToken());
   dispatch(removeProfile());
   toggleHandler();
   toast.success("Logout Successfully")
  }
  return (
 <div className='relative'>
     <div className='flex items-center cursor-pointer' onClick={toggleHandler}>
      <img src={userProfile?.profilePicture} alt="userImage"  className='h-[46px] w-[46px] rounded-full object-cover'/>
      <IoMdArrowDropdown size={25}/>

    </div>
    {
    toggle  && <div className='bg-richblack-700 absolute lg:top-16 rounded-md p-4 flex flex-col gap-2 lg:-left-8 z-50'>
        <div className='flex items-center gap-1 hover:bg-richblack-900 transition-all duration-300 px-2 py-1 rounded-md cursor-pointer'
        onClick={()=>{
          toggleHandler();
          navigate("/dashboard")}}>
          <RxDashboard/>
          <p>Dashboard</p>
        </div>
        <div className='flex items-center gap-1 hover:bg-richblack-900 transition-all duration-300 px-2 py-1 rounded-md cursor-pointer'
       onClick={()=>{setConfirmToggle(true)
        toggleHandler();
       }}>
         <CiLogout/>
         <p>Logout</p>
        </div>
    </div>
    }
    {
      confirmToggle && <ConfirmationModal
       setConfirmToggle={setConfirmToggle}
       btn1={"Cancel"}
       btn2={"Yes"}
       heading={"Logout Confirmation"}
       desc={"Are you sure want to logout?"}
       onclick={logOutHandler}
      />
    }
 </div>
  )
}

export default ProfileDropDown