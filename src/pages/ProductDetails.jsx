import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdOutlineLocalShipping,
  MdOutlineCached,
  MdOutlinePayments,
  MdOutlineReceiptLong,
} from "react-icons/md";
import { FaShare } from "react-icons/fa";
import { calculateAverageRating } from "../utils/CalculateAverageRating";
import ReactStars from "react-stars";
import axios from "axios";
import toast from "react-hot-toast";
import Footer from "../components/common/Footer";
import Spinner from "../components/common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../redux/slices/cart";
import CategoryProductCard from "../components/core/Category/CategoryProductCard";
import RatingAndReview from "../components/core/Product/RatingAndReview";

const ProductDetails = () => {
  const { productId } = useParams();
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [similarProducts,setSimilarProducts] = useState([]);
  const dispatch = useDispatch();
  const {productData} = useSelector((state)=> state.cart);
  const navigate = useNavigate();
  const {token}  = useSelector((state) => state.auth)

  const getProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/productDetails/${productId}`
      );

      if (!response?.data?.success) {
        throw new Error("Failed to fetch product details");
      }

      setProductDetails(response?.data?.productDetails);
      setSimilarProducts(response?.data?.similarProducts);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };
useEffect(() => {
  getProductDetails();
}, [productId]);


  const handleShare = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url)
    .then(() => {
      toast.success("Link copied to clipboard!");
    })
    .catch(() => {
      toast.error("Failed to copy link");
    });
};

const buyNowHandler = () =>{
  if(!token){
    toast.error("Please log in to purchase this product");
    return;
  }
  navigate("/buy-now-information",{state:{productDetails:productDetails}})
}

const addtoCartHandler = ()=>{
    if(!token){
    toast.error("Please log in to add products to your cart");
    return;
  }
  dispatch(addTocart(productDetails))
}
const removeFromCartHandler = ()=>{
     if(!token){
    toast.error("Please log in to remove items from your cart");
    return;
  }
  dispatch(removeFromCart(productDetails))
}

  return (
<>
{
    loading ? <div className="flex items-center justify-center h-[calc(94vh-64px)]"><Spinner/></div> :     <div className="w-full bg-richblack-900 text-white min-h-screen">
      <div className="w-11/12 max-w-[1280px] mx-auto py-10 flex flex-col lg:flex-row gap-10">

        {/* LEFT SIDE - Product Image */}
        <div className="lg:w-1/2 flex flex-col items-center gap-6">
          <div className="w-full flex flex-col items-center gap-4 bg-richblack-800 p-4 rounded-md">
            <img
              src={productDetails?.image}
              alt={productDetails?.name}
              className="w-full max-w-[500px] max-h-[400px] object-contain rounded-md"
            />
            <button
              onClick={() => window.open(productDetails?.image, "_blank")}
              className="bg-yellow-200 hover:bg-yellow-300 text-richblack-900 px-4 py-2 text-sm rounded transition"
            >
              View Full Image
            </button>
          </div>

          {/* Cart Buttons */}
          <div className="flex w-full gap-4 mt-4">
        
            {
                productData.some((product) => product._id === productDetails?._id) ?   <button onClick={removeFromCartHandler} className="flex-1 bg-richblack-700 text-richblack-5 font-semibold py-2 rounded hover:bg-richblack-800 transition">
            Remove Item
            </button> :    <button onClick={addtoCartHandler} className="flex-1 bg-yellow-200 text-richblack-900 font-semibold py-2 rounded hover:bg-yellow-300 transition">
              Add to Cart
            </button>
            }
       
            <button className="flex-1 bg-pink-300 text-white font-semibold py-2 rounded hover:bg-pink-400 transition"
            onClick={()=>{buyNowHandler(productDetails)}}>
              Buy Now
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - Product Info */}
        <div className="lg:w-1/2 flex flex-col gap-4">
     <div className="text-2xl lg:text-3xl font-semibold break-words leading-snug">
  {productDetails?.name}
</div>


          {/* Ratings */}
          <div className="flex items-center gap-4 text-yellow-400">
            <ReactStars
              count={5}
              edit={false}
              value={calculateAverageRating(productDetails?.reviews)}
              size={24}
              color2={"#ffd700"}
            />
            <p className="text-richblack-200 text-sm">
              ({productDetails?.reviews?.length} Ratings)
            </p>
          </div>

          {/* Price */}
          <div className="text-xl text-green-400 font-semibold flex gap-2 items-center">
            ₹
            {(productDetails?.price *
              (1 - productDetails?.discount / 100)).toFixed(2)}
            <span className="line-through text-richblack-400 text-sm ml-2">
              ₹{productDetails?.price}
            </span>
            <span className="text-yellow-300 text-sm ml-2">
              ({productDetails?.discount}% OFF)
            </span>
          </div>

          {/* Info */}
          <div className="text-sm text-richblack-300 space-y-1">
            <p>
              Brand:{" "}
              <span className="text-white font-medium">
                {productDetails?.vendor?.storeName}
              </span>
            </p>
            <p>Trusted by {productDetails?.totalBuyers?.length} customers</p>
            <p>30-Day Money-Back Guarantee</p>
          </div>

          {/*  Common Services */}
          <div className="bg-richblack-800 p-4 rounded text-caribbeangreen-100 text-sm space-y-3 mt-4">
            <p className="font-medium text-white">Available Services:</p>
            <div className="flex gap-2 items-center">
              <MdOutlineLocalShipping />
              <span>Free Delivery</span>
            </div>
            <div className="flex gap-2 items-center">
              <MdOutlineCached />
              <span>10 Days Replacement</span>
            </div>
            <div className="flex gap-2 items-center">
              <MdOutlinePayments />
              <span>Cash on Delivery Available</span>
            </div>
            <div className="flex gap-2 items-center">
              <MdOutlineReceiptLong />
              <span>GST Invoice Available</span>
            </div>
          </div>

          {/* Share Button */}
          <div className="text-yellow-50 flex items-center gap-2 cursor-pointer mt-4" onClick={handleShare}>
            <FaShare />
            <span>Share</span>
          </div>
          
        </div>
      </div>

      {/* DESCRIPTION SECTION */}
      <div className="w-11/12 max-w-[1280px] mx-auto mt-10">
        <div className="border border-richblack-700 p-6 rounded bg-richblack-800">
          <h2 className="text-2xl font-semibold mb-4">Product Description</h2>
          <div className="text-richblack-200 text-sm leading-relaxed whitespace-pre-line break-words">
  {productDetails?.description}
</div>

        </div>

        {/* BRAND INFO */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold">Brand Information</h3>
          <div className="flex items-center gap-4 mt-3">
            <img
              src={productDetails?.vendor?.storeLogo}
              alt="Brand Logo"
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-white">
                {productDetails?.vendor?.storeName}
              </p>
              <p className="text-richblack-300">
                {productDetails?.vendor?.storeDescription}
              </p>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-center">
           Ratings & Reviews
          </h3>
        {productDetails?._id && (
  <RatingAndReview productId={productDetails._id} />
)}
        </div>
           {/* similar products  */}
      {
        similarProducts.length > 0 && <CategoryProductCard productDataH={similarProducts} productNameH={"Recommended for You"}/>
      }
      </div>

   

    <div className="mt-12">
        <Footer />
    </div>
    </div>
}
</>
  );
};

export default ProductDetails;
