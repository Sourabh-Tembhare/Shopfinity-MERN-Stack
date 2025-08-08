import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PiSealCheckFill } from "react-icons/pi";
import YellowUnButton from "../../common/YellowUnButton";
import ConfirmationModal from "../../common/ConfirmationModal";
import { useLocation, useNavigate } from "react-router-dom";
import { removeToken } from "../../../redux/slices/auth";
import { removeProfile } from "../../../redux/slices/profile";
import toast from "react-hot-toast";
import { GoUnverified } from "react-icons/go";
import LocationModal from "./LocationModal";
import axios from "axios";
import { removeFromCart } from "../../../redux/slices/cart";

const BuyNowInformation = () => {
  const { userProfile } = useSelector((state) => state.profile);
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [locationModal, setLoactionModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const productDetails = location.state?.productDetails;
  const [itemValue, setItemValue] = useState(1);
  const {token} = useSelector((state) => state.auth);
  const {productData} = useSelector((state) => state.cart);

  

  const logOutHandler = () => {
    navigate("/login");
    dispatch(removeToken());
    dispatch(removeProfile());
    toast.success("Logout Successfully");
  };

  const [formData,setFormData] = useState({mode:"upi"});
  const [loading,setLoading] = useState(false);

const onChangeHandler = (event) => {
  const { name, value } = event.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
  
};

const confirmOrderHandler =  async()=>{
  if(!formData.mode){
    toast.error("Please select the payment option");
    return ;
  }
  if(!userProfile?.location){
       toast.error("Please add your location");
       return ;
    }
    const finalPrice = (
    productDetails?.price *
    (1 - productDetails?.discount / 100) *
    itemValue
  ).toFixed(2);

  if(formData.mode === "upi"){
    const data = {
      productId:productDetails?._id,
      productPrice:productDetails?.price,
      quantity:itemValue,
      totalPrice:finalPrice,
      shippingAddress:userProfile?.location,
    }
    handlePayment(data);
  }
  else{
    const data = {
      productId:productDetails?._id,
      productPrice:productDetails?.price,
      quantity:itemValue,
      totalPrice:finalPrice,
      shippingAddress:userProfile?.location,
    }
    codOrderCreate(data);

  }

}
  const handlePayment = async (data) => {
     if(!token){
     toast.error("Please log in to continue.");
     return ;
    }
    const toastId = toast.loading("Processing payment...");
    try {
      setLoading(true);
         const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/api/v1";
      const { data: orderData } = await axios.post(
        `${BASE_URL}/upi-order`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.dismiss(toastId);   
      loadRazorpay(orderData);
     
      
    } catch (err) {
      setLoading(false);
      console.error("Payment Error:", err);
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
  
  const loadRazorpay = (orderData) => {
    const options = {
      key:"rzp_test_KQl8eMmQzBU9l8",
      currency: orderData?.razorpayOrder?.currency,
      amount: orderData?.razorpayOrder?.amount,
      name: "Shopfinity",
      description: "Product Purchase",
      order_id: orderData?.razorpayOrder?.id,
      handler: async function (response) {
        const toastId = toast.loading("Verifying payment...");
        try {
               const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/api/v1";
          const verifyRes = await axios.post(
            `${BASE_URL}/upi-order-verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: userProfile?._id,
              productId:productDetails?._id,
              vendorId:productDetails?.vendor,
              orderId:orderData?.productOrder?._id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.dismiss(toastId);
          toast.success(verifyRes.data.message || "Payment successful!");
          
       // After successful payment
if (productData.some((item) => item._id === productDetails?._id)) {
  dispatch(removeFromCart(productDetails));
} 
toast.success("Order confirmed. Thank you for shopping with us!");
navigate("/dashboard/my-orders");
setLoading(false);
} catch (verifyErr) {
          setLoading(false);
          console.error("Verification Error:", verifyErr);
          toast.dismiss(toastId);
          toast.error("Payment verification failed.");
        }
      },
      theme: { color: "#5f63b8" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  };

  const codOrderCreate = async(data)=>{
    const toastId = toast.loading("Processing your order...");
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/cod-create-order`,data,{
        headers:{
          Authorization:'Bearer '+token,
        }
      })
      if(!response?.data?.success){
        throw new Error("Error occur during creating order");
      }
      toast.dismiss(toastId);
      toast.success(response?.data?.message);
if (productData.some((item) => item._id === productDetails?._id)) {
  dispatch(removeFromCart(productDetails));
} 
      navigate("/dashboard/my-orders");
      setLoading(false);   
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");   
    }
  }

  return (
    <div className="text-richblack-5 w-11/12 mx-auto mt-4 mb-4 flex lg:flex-row flex-col justify-center gap-4">
   <div className="lg:w-[75%]">
       <div className="flex flex-col gap-4">
        {/* login information  */}
        <div className="bg-richblack-800 flex sm:justify-between p-4 rounded-md sm:items-center sm:flex-row flex-col sm:gap-0 gap-2">
          <div className="flex flex-row gap-2">
            <div className="h-10 w-10 bg-richblack-700 rounded-full flex justify-center items-center ">
              <p className="font-semibold">1</p>
            </div>
            <div className="flex flex-col ">
              <div className="flex flex-row gap-1 items-center ">
                <p>LOGIN</p>
                <PiSealCheckFill className="text-caribbeangreen-200" />{" "}
              </div>
              <div className="flex gap-2">
                <p>{userProfile?.firstName}</p>
                <p>{userProfile?.phoneNumber}</p>
              </div>
            </div>
          </div>

          <YellowUnButton
            text={"Logout"}
            onclickHandler={() => {
              setConfirmToggle(true);
            }}
          />
        </div>

        {/* Delivery address  */}
        <div className="bg-richblack-800 flex sm:justify-between p-4 rounded-md sm:items-center flex-col sm:flex-row sm:gap-0 gap-2">
          <div className="flex flex-row gap-2">
            <div className="h-10 w-10 bg-richblack-700 rounded-full flex justify-center items-center ">
              <p className="font-semibold">2</p>
            </div>
            <div>
              <div className="flex flex-row gap-1 items-center ">
                {" "}
                <p>DELIVERY ADDRESS</p>{" "}
                {userProfile?.location ? (
                  <PiSealCheckFill className="text-caribbeangreen-200" />
                ) : (
                  <GoUnverified className="text-pink-200" />
                )}
              </div>

              <p>
                {userProfile?.location
                  ? `${userProfile?.location}`
                  : "Add your address"}
              </p>
            </div>
          </div>

          <YellowUnButton
            text={"Change"}
            onclickHandler={() => {
              setLoactionModal(true);
            }}
          />
        </div>

        {/* order summary  */}
        <div className="bg-richblack-700 flex flex-col rounded-md ">
          <div className="flex justify-between items-center bg-richblack-800  p-4 rounded-t-md">
            <div className="flex gap-2 items-center">
              <div className="h-10 w-10 bg-richblack-700 rounded-full flex justify-center items-center ">
                <p className="font-semibold">3</p>
              </div>
              <p>ORDER SUMMARY</p>
            </div>
            <p className="text-richblack-200">Total Items : {itemValue}</p>
          </div>
          <div className="p-4 flex sm:flex-row flex-col gap-8">
            <div className="flex flex-col gap-2  sm:w-[112px] justify-center items-center ">
              <div className="sm:h-[112px] sm:w-[112px] ">
                <img
                  src={productDetails?.image}
                  alt={`${productDetails?.name}Image`}
                  className="object-cover h-full w-full"
                />
              </div>
              <div className="flex flex-row gap-4">
                <button
                  disabled={itemValue <= 1}
                  className="font-bold text-[18px]"
                  onClick={() => {
                    setItemValue(itemValue - 1);
                  }}
                >
                  -
                </button>
                <input
                  type="text"
                  value={itemValue}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (/^\d*$/.test(value)) {
                      const numericValue = Number(value);
                      setItemValue(numericValue < 1 ? 1 : numericValue);
                    }
                  }}
                  name=""
                  id=""
                  className=" text-center   w-[40px] bg-transparent border-[2px] border-richblack-400 outline-none text-richblack-200"
                />
                <button
                  className="font-bold text-[18px]"
                  onClick={() => {
                    setItemValue(itemValue + 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-richblack-50 flex flex-col gap-2">
              <p className=" text-xl">
                {productDetails?.name.length > 70
                  ? `${productDetails?.name.substring(0, 50)}...`
                  : `${productDetails?.name}`}
              </p>
              <p>Seller : {productDetails?.vendor?.storeName}</p>
              <div>
                <div className="text-richblack-100  ">
                  ₹{productDetails?.price}
                </div>

                {productDetails?.discount > 0 && (
                  <>
                    <p className="text-sm text-yellow-300 ">
                      Discount: {productDetails?.discount}%
                    </p>
                    <p className="text-sm text-green-400 ">
                      Final Price: ₹
                      {(
                        productDetails?.price *
                        (1 - productDetails?.discount / 100)
                      ).toFixed(2)}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* payment options  */}
        <div className="bg-richblack-700 rounded-md">
          <div className="flex gap-2 items-center p-4 bg-richblack-800 rounded-t-md">
            <div className="h-10 w-10 bg-richblack-700 rounded-full flex justify-center items-center ">
              <p className="font-semibold">4</p>
            </div>
            <p>PAYMENT OPTIONS</p>
          </div>
          <div className="p-4">
            <form className="flex flex-col gap-4">
              <label className="flex flex-row gap-4 items-center">
                <input type="radio" onChange={onChangeHandler} name="mode" value="upi" checked={formData.mode  === "upi"}/>
                <p>UPI</p>
              </label>
              <label className="flex flex-row gap-4 items-center">
                <input type="radio"   onChange={onChangeHandler} name="mode" value="cash_on_delivery" checked={formData.mode  === "cash_on_delivery"}/>
                <p>Cash on Delivery</p>
              </label>
            </form>
          </div>
        </div>
      </div>
   </div>
    <div className="bg-richblack-800 p-4 lg:w-[25%] h-fit flex flex-col gap-4">
        <p>PRICE DETAILS</p>
        <div className="h-[2px] w-full bg-richblack-600"></div>
        <div className="flex justify-between">
            <p>Price ( <span>{itemValue} item</span> )</p>
       <p>
  ₹
  {(
    productDetails?.price *
    (1 - productDetails?.discount / 100) *
    itemValue
  ).toFixed(2)}
</p>

        </div>
        <button disabled={loading} onClick={confirmOrderHandler} className='bg-yellow-200 px-6 py-2 font-semibold text-richblack-900 hover:bg-yellow-300 rounded-md transition-all duration-300 cursor-pointer  flex justify-center items-center'>Confirm Order</button>
    </div>

      {confirmToggle && (
        <ConfirmationModal
          setConfirmToggle={setConfirmToggle}
          btn1={"Cancel"}
          btn2={"Yes"}
          heading={"Logout Confirmation"}
          desc={"Are you sure want to logout?"}
          onclick={logOutHandler}
        />
      )}
      {locationModal && <LocationModal setLoactionModal={setLoactionModal} />}
    </div>
  );
};

export default BuyNowInformation;
