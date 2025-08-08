import React, { useState } from 'react'
import { SiShopify } from "react-icons/si";
import { Link, useLocation } from 'react-router-dom';
import { SlMagnifier, SlMenu } from "react-icons/sl";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';

import UniversalButton from './UniversalButton';
import ProfileDropDown from "../core/Navbar/ProfileDropDown";
import NavbarSideBar from '../core/Navbar/NavbarSideBar';


const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const [toggle, setToggle] = useState(false);
  const {productData} = useSelector((state) => state.cart)
  const location = useLocation();

  return (
    <div className="bg-richblack-800 border-b-2 border-richblack-700 w-full">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-16 text-richblack-5">

        {/* Left - Logo */}
        <Link to="/" className="flex items-center ">
          <SiShopify size={30} />
          <span className="text-2xl sm:text-3xl font-bold hidden sm:block">hopfinity</span>
        </Link>

        {/* Middle - Search */}
        <div className="flex-1 mx-4 flex">
          <label className="relative w-full">
            <SlMagnifier className="absolute left-4 top-1/2 -translate-y-1/2 text-richblack-300" size={18} />
            <input
              type="text"
              placeholder="Search for Products, Brands and More"
              className="w-full pl-12 pr-4 py-2 bg-richblack-700 text-sm sm:text-base rounded-md outline-none placeholder:text-richblack-300"
            />
          </label>
        </div>

      
        <div className="hidden lg:flex items-center gap-6">
        
          <Link to="/aboutUs" className={` transition-colors ${location.pathname === "/aboutUs" ? "text-yellow-50 hover:text-yellow-100" : "text-richblack-5 hover:text-richblack-100"}`}>
            About
          </Link>
          <Link to="/contactUs" className={` transition-colors ${location.pathname === "/contactUs" ? "text-yellow-50 hover:text-yellow-100" : "text-richblack-5 hover:text-richblack-100"}`}>
            Contact Us
          </Link>

          {!token ? (
            <>
              <UniversalButton to="/login">Login</UniversalButton>
              <UniversalButton to="/signup">Sign Up</UniversalButton>
            </>
          ) : (
            <ProfileDropDown />
          )}

          <Link to="/dashboard/mycart" className="flex items-center gap-1 cursor-pointer relative">
            <IoCartOutline size={24} />
            <p className="text-base font-medium">Cart</p>
            {
              productData.length > 0 && <span className='text-yellow-50 text-[18px] font-semibold absolute -top-5 left-2'>{productData.length}</span>
            }
          </Link>
        </div>

      
        <div className="flex items-center lg:hidden gap-4">
          <Link to="/dashboard/mycart" className="relative">
            <IoCartOutline size={24} />
            {productData.length > 0 && (
              <span className='text-yellow-50 text-sm font-semibold absolute -top-2 -right-2 bg-richblue-500 rounded-full w-5 h-5 flex items-center justify-center'>
                {productData.length}
              </span>
            )}
          </Link>

       
          <button onClick={() => setToggle(true)} className="text-richblack-300">
            <SlMenu size={22} />
          </button>
        </div>
      </div>

    
      {toggle && <NavbarSideBar setToggle={setToggle} />}
    </div>
  );
};

export default Navbar;