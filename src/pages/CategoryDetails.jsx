import React, { useEffect, useState } from "react";
import { FiTrendingUp, FiHeart, FiShoppingBag } from "react-icons/fi";
import { BsLightningFill, BsFire, BsGem, BsCashCoin } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Spinner from "../components/common/Spinner";

const CategoryDetails = () => {
    const params = useParams();
    const categorryId = params.categoryId;
    const [loading,setLoading] = useState(false);
    const [categoryDetails,setCategoryDetails] = useState({});
    const [topSellingProducts,setTopSellingProducts] = useState([]);
    const [trendingNowProducts,setTrendingNowProducts]  = useState([]);
    const [mostLovedProducts,setMostLovedProducts] = useState([]);
    const [bestDealProducts,setBestDealProducts] = useState([]);
    const navigate = useNavigate();

    const categoryPageDetails = async(req,res)=>{
        try {
            setLoading(true);
            const response = await  axios.get(`${process.env.REACT_APP_BASE_URL}/categoryPageDetails/${categorryId}`);
            if(!response?.data?.success){
                throw  new Error("Error occur during fetching categoryPageDetails");
            }
            setCategoryDetails(response?.data?.categoryDetails);
            setTopSellingProducts(response?.data?.topSellingProducts);
            setTrendingNowProducts(response?.data?.trendingNowProducts);
            setMostLovedProducts(response?.data?.mostLovedProducts);
            setBestDealProducts(response?.data?.bestDealProducts);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Something went wrong");  
        }
    }

    useEffect(()=>{
        categoryPageDetails();
    },[])

    const topSellingProductHandler = ()=>{
     navigate("/categopry-product-card",{state:{productData:topSellingProducts,productName:"Top Selling Products"}});
    }

    const trendingNowProductHandler = ()=>{
     navigate("/categopry-product-card",{state:{productData:trendingNowProducts,productName:"Trending Now"}});
    }

    const mostLovedProductHandler = ()=>{
     navigate("/categopry-product-card",{state:{productData:mostLovedProducts,productName:"Most Loved Products"}});
    }

    const bestDealProductHandler = ()=>{
     navigate("/categopry-product-card",{state:{productData:bestDealProducts,productName:"Shopfinity Best Deals - Limited Time Only"}});
    }
  return (
<div className="h-full">
{
    loading ? <div className="flex items-center justify-center h-[calc(92vh-64px)]"><Spinner/></div> :     <div className="bg-richblack-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Category Header with decorative elements */}
        <div className="text-center mb-16 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-25 to-pink-400 mb-4">
          {
            categoryDetails?.name
          }
          </h1>
          <p className="text-richblack-300 max-w-3xl mx-auto text-lg">
          {
            categoryDetails?.description
          }
          </p>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Selling Banner */}
          <div onClick={topSellingProductHandler} className="group relative rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-richblack-800 to-richblack-700 border border-richblack-700 cursor-pointer transition-all duration-500 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(56,182,255,0.2)]">
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8">
              <div className="flex items-center mb-4">
                <BsLightningFill className="text-blue-400 text-2xl mr-3" />
                <span className="text-xs font-semibold tracking-widest text-blue-400">
                  POPULAR CHOICE
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <FiTrendingUp className="mr-2" /> Top Sellers
              </h2>
              <p className="text-richblack-300 mb-6">
                Products flying off our shelves this week
              </p>
              <div className="w-full h-[2px] bg-gradient-to-r from-blue-400/30 to-transparent mb-6"></div>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all flex items-center group-hover:translate-x-2 duration-300">
                Explore Collection
              </button>
            </div>
            <div className="absolute right-0 top-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 0C44.8 0 0 44.8 0 100C0 155.2 44.8 200 100 200C155.2 200 200 155.2 200 100C200 44.8 155.2 0 100 0Z"
                  fill="url(#paint0_radial)"
                />
                <defs>
                  <radialGradient
                    id="paint0_radial"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(100 100) rotate(90) scale(100)"
                  >
                    <stop stopColor="#3B82F6" />
                    <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Trending Now Banner */}
          <div onClick={trendingNowProductHandler} className="group relative rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-richblack-800 to-richblack-700 border border-richblack-700 cursor-pointer transition-all duration-500 hover:border-pink-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8">
              <div className="flex items-center mb-4">
                <BsFire className="text-pink-400 text-2xl mr-3" />
                <span className="text-xs font-semibold tracking-widest text-pink-400">
                  HOT RIGHT NOW
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <FiTrendingUp className="mr-2" /> Trending Now
              </h2>
              <p className="text-richblack-300 mb-6">
                What everyone's talking about this season
              </p>
              <div className="w-full h-[2px] bg-gradient-to-r from-pink-400 to-transparent mb-6"></div>
              <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-all flex items-center group-hover:translate-x-2 duration-300">
                View Trends
              </button>
            </div>
            <div className="absolute right-0 bottom-0 w-40 h-40 bg-pink-500/20 rounded-full filter blur-[60px] group-hover:blur-[80px] transition-all duration-700"></div>
          </div>

          {/* Most Loved Banner */}
          <div onClick={mostLovedProductHandler} className="group relative rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-richblack-800 to-richblack-700 border border-richblack-700 cursor-pointer transition-all duration-500 hover:border-pink-400 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]">
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8">
              <div className="flex items-center mb-4">
                <BsGem className="text-pink-400 text-2xl mr-3" />
                <span className="text-xs font-semibold tracking-widest text-pink-400">
                  CUSTOMER FAVORITES
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <FiHeart className="mr-2" /> Most Loved
              </h2>
              <p className="text-richblack-300 mb-6">
                Products our community adores
              </p>
              <div className="w-full h-[2px] bg-gradient-to-r from-pink-400/30 to-transparent mb-6"></div>
              <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-all flex items-center group-hover:translate-x-2 duration-300">
                See Favorites
              </button>
            </div>
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-pink-500/10 filter blur-[50px] group-hover:blur-[70px] transition-all duration-700"></div>
            <div className="absolute left-6 top-6 text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              ❤
            </div>
          </div>

          {/* Best Deals Banner */}
          <div onClick={bestDealProductHandler} className="group relative rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-richblack-800 to-richblack-700 border border-richblack-700 cursor-pointer transition-all duration-500 hover:border-caribbeangreen-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <div className="absolute inset-0 flex flex-col items-start justify-end p-8">
              <div className="flex items-center mb-4">
                <BsCashCoin className="text-caribbeangreen-400 text-2xl mr-3" />
                <span className="text-xs font-semibold tracking-widest text-caribbeangreen-400">
                  LIMITED TIME
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <FiShoppingBag className="mr-2" /> Best Deals
              </h2>
              <p className="text-richblack-300 mb-6">
                Unbeatable prices on premium products
              </p>
              <div className="w-full h-[2px] bg-gradient-to-r from-caribbeangreen-400/30 to-transparent mb-6"></div>
              <button className="px-6 py-3 bg-caribbeangreen-600 hover:bg-caribbeangreen-700 rounded-lg font-medium transition-all flex items-center group-hover:translate-x-2 duration-300">
                Shop Deals
              </button>
            </div>
            <div className="absolute right-0 top-0 w-full h-full opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <div className="absolute right-10 top-10 w-24 h-24 border-2 border-caribbeangreen-400 rounded-full"></div>
              <div className="absolute right-20 top-24 w-12 h-12 border-2 border-caribbeangreen-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Category Description Footer */}
        <div className="mt-20 text-center border-t border-richblack-700 pt-12">
          <h3 className="text-xl font-semibold mb-4">
            Discover Excellence with Shopfinity
          </h3>
          <p className="text-richblack-300 max-w-3xl mx-auto">
            At Shopfinity, we curate only the finest products to elevate your
            shopping experience. Our collection combines quality craftsmanship
            with exceptional value, offering you carefully selected items that
            meet the highest standards. Whether you're treating yourself or
            shopping for loved ones, find exactly what you need with
            Shopfinity's premium selection.
          </p>
        </div>
      </div>
    </div>
}
</div>
  );
};

export default CategoryDetails;
