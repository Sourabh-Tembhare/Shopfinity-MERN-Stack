import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AllCategory from "../components/core/HomePage/AllCategory";
import homeBanner from "../assets/homeBanner.avif";
import axios from 'axios';
import toast from 'react-hot-toast';
import ProductsCard from '../components/core/HomePage/ProductsCard';
import Footer from '../components/common/Footer';

const Home = () => {
  const [loading,setLoading] = useState(false);
  const [topDeals,setTopDeals] = useState([]);
  const [newLaunches,setNewLaunches] = useState([]);
  const [topRated,setTopRated] = useState([]);
  const [dealsUnder,setDealsUnder] = useState([]);

  const homePageProducts = async() =>{
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/homePageProducts`);
      if(!response?.data?.success){
        throw new Error("Error occur during fetching home page products");
      }
      setTopDeals(response?.data?.topDeals);
      setNewLaunches(response?.data?.newLaunches);
      setTopRated(response?.data?.topRated);
      setDealsUnder(response?.data?.dealsUnder);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      
    }
  }

  useEffect(()=>{
    homePageProducts();
  },[])
  return (
    <div className="bg-richblack-900 text-richblack-5">
      {/* Hero Carousel Section */}
      <div className="relative bg-richblack-800 h-64 md:h-96 overflow-hidden">
        <div className="absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold text-richblack-5 mb-2">
              Summer Sale Live Now
            </h1>
            <p className="text-richblack-100 mb-4">
             Grab Your Favorites Before They're Gone
            </p>
            <Link 
              to="/" 
              className="inline-block bg-yellow-200 text-richblack-900 px-6 py-2 rounded-md font-medium hover:bg-yellow-300 transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-richblack-900/70 to-transparent"></div>
        <img 
          src={homeBanner}
          className="w-full h-full object-cover"
          alt="Summer Sale"
        />
      </div>

      {/* Categories Section */}
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <AllCategory />
      </div>

   <div className='p-4 flex flex-col gap-16'>
       {/* homePageProducts*/}
      {
        loading ?   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-richblack-800 h-40 rounded-md" />
    ))}
  </div> : topDeals.length > 0 && <ProductsCard data={topDeals} name={"Top Deals of the Day"} />
      }
      




           {
        loading ?   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-richblack-800 h-40 rounded-md" />
    ))}
  </div> : newLaunches.length > 0 && <ProductsCard data={newLaunches} name={"New Launches"} />
      }





                 {
        loading ?   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-richblack-800 h-40 rounded-md" />
    ))}
  </div> : topRated.length > 0 && <ProductsCard data={topRated} name={"Top Rated Products"} />
      }




      
                 {
        loading ?   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-richblack-800 h-40 rounded-md" />
    ))}
  </div> : dealsUnder.length > 0 && <ProductsCard data={dealsUnder} name={"Deal Under ₹999"} />
      }
   </div>
 <div className='mt-12'>
    <Footer/>
 </div>
    </div>
  );
};

export default Home;