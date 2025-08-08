import React from 'react'
import { ImCross } from "react-icons/im";
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import ProfileDropDown from './ProfileDropDown';
import SideNav from '../Dashboard/SideNav';
import { FcAbout } from "react-icons/fc";

const NavbarSideBar = ({ setToggle }) => {
  const { userProfile } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 w-[80%] max-w-xs h-full bg-richblack-800 text-richblack-5 z-50 shadow-lg flex flex-col overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-richblack-900 border-b border-richblack-700">
        <div className="text-lg font-semibold ">
          Hello, {" "}{" "}
          <span className="font-bold">
            {userProfile ? <p>{userProfile.firstName.length > 10 ? `${userProfile?.firstName.substring(0,10)}...` : `${userProfile?.firstName}`}</p> : "Guest"}
          </span>
        </div>
        <ImCross
          size={20}
          className="cursor-pointer text-richblack-300 hover:text-pink-300"
          onClick={() => setToggle(false)}
        />
      </div>

      {/* Auth Links (only when not logged in) */}
      {!token && (
        <div className="flex flex-col gap-2 px-4 py-4 border-b border-richblack-700">
          <Link
            to="/login"
            onClick={() => setToggle(false)}
            className="py-2 px-3 rounded-md bg-yellow-50 text-richblack-900 font-semibold text-center hover:bg-yellow-100 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={() => setToggle(false)}
            className="py-2 px-3 rounded-md bg-yellow-50 text-richblack-900 font-semibold text-center hover:bg-yellow-100 transition"
          >
            Sign Up
          </Link>
        </div>
      )}
           <div className=' flex flex-col gap-4 mt-4'>
            <Link to="/aboutUs" className={`flex gap-2 transition-colors pl-4 py-2 ${location.pathname === "/aboutUs" ? "text-yellow-50 hover:text-yellow-100 border-l-[4px] border-yellow-50 bg-yellow-800" : "text-richblack-5 hover:text-richblack-100"}`}>
               <p className='h-6 w-6 bg-richblack-600 rounded-full flex items-center justify-center font-bold'>A</p>  <p className='text-richblack-200'>About</p>
                </Link>
                <Link to="/contactUs" className={`flex gap-2 transition-colors pl-4 py-2 mb-2 ${location.pathname === "/contactUs" ? "text-yellow-50 hover:text-yellow-100 border-l-[4px] border-yellow-50 bg-yellow-800" : "text-richblack-5 hover:text-richblack-100"}`}>
                 <p className='h-6 w-6 bg-richblack-600 rounded-full flex items-center justify-center font-bold'>C</p><p className='text-richblack-200'> Contact Us</p>
                </Link>

           </div>
    
 

      {/* Profile Dropdown (only when logged in) */}
      {token && (
        <div className="px-4 py-4 border-b border-richblack-700 md:block hidden">
          <ProfileDropDown />
        </div>
      )}
      {
        token && userProfile && <div className='md:hidden block'><SideNav/></div>
      }

    </div>
  );
};

export default NavbarSideBar;
