import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import YellowUnButton from '../../common/YellowUnButton';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReviewModal from './ReviewModal';


const MyOrderDetails = () => {
  const location = useLocation();
  const order = location.state.product;
  const product = order.product;
  const [loading,setLoading] = useState(false);
  const {token} = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [reviewModal,setReviewModal] = useState(false);

  const cancleOrderHandler = async(orderId)=>{
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if(!confirmCancel){
      return ;
    }
   const toastId = toast.loading("Processing your cancellation request...");
   try {
    setLoading(true);
    const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/cancelOrder`,{orderId},
        {
            headers:{
                Authorization:'Bearer '+token,
            }
        }
    )

    if(!response?.data?.success){
        throw new  Error("Error occur during order cancellation request");
    }
    toast.dismiss(toastId);
    toast.success(response?.data?.message);
    navigate("/dashboard/my-orders");
    setLoading(false);
   } catch (error) {
    toast.dismiss(toastId);
    console.log(error);
    setLoading(false);
    toast.error(error.response?.data?.message || "Something went wrong");
    
   }
  }

  const returnProductHandler = async(orderId)=>{
    const confirmReturn = window.confirm("Are you sure you want to return this order?");
    if(!confirmReturn){
      return  ;
    }
    const toastId = toast.loading("Submitting return request...");
    try {
        setLoading(true);
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/returnProduct`,{orderId},{
            headers:{
                Authorization:'Bearer '+token,
            }
        });
        if(!response?.data?.success){
            throw new Error("Error occur during product return request");
        }
        toast.dismiss(toastId);
        toast.success(response?.data?.message);
        navigate("/dashboard/my-orders");
        setLoading(false);

        
    } catch (error) {
    toast.dismiss(toastId);
    console.log(error);
    setLoading(false);
    toast.error(error.response?.data?.message || "Something went wrong");
        
    }
  }

 
  return (
    <div className="  text-richblack-5 p-4">
        
      <div className="  bg-richblack-800 rounded-lg shadow-lg p-6 space-y-6">

        {/* Header */}
        <div className="border-b border-richblack-600 pb-4 mb-4">
          <h1 className="text-2xl font-semibold">Order Details</h1>
          <p className="text-richblack-300 text-sm">
            Order placed on {moment(order.createdAt).format('dddd, MMMM D, YYYY • hh:mm A')}
          </p>
        </div>

        {/* Product Info */}
        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={product?.image}
            alt={product?.name}
            className="w-32 h-32 object-contain rounded bg-richblack-700"
          />
          <div className="flex-1 space-y-2">
            <h2 className="text-lg font-medium">{product?.name}</h2>
            <p className="text-richblack-300 text-sm">{product?.description}</p>
            <p className="text-yellow-50 font-semibold">
              ₹{product?.price} <span className="text-richblack-300 text-xs ml-2">(Original)</span>
            </p>
           <p className="text-caribbeangreen-100 font-semibold">
  ₹{order?.totalPrice.toFixed(2)}{" "}
  <span className="text-richblack-300 text-xs ml-2">
    (Paid for {order?.quantity} {order?.quantity > 1 ? "items" : "item"})
  </span>
</p>

          </div>
        </div>

        {/* Order Status */}
        <div className="space-y-1">
          <h3 className="text-md font-semibold">Status</h3>
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${
                order?.status === 'Pending'
                  ? 'bg-yellow-50'
                  : order?.status === 'Processing'
                  ? 'bg-blue-200'
                  : order?.status === 'Shipped'
                  ? 'bg-caribbeangreen-100'
                  : order?.status === 'Delivered'
                  ? 'bg-caribbeangreen-200'
                  : 'bg-pink-200'
              }`}
            ></span>
            <span className="font-medium">{order?.status}</span>
          </div>
          <p className="text-richblack-300 text-sm">
            {order?.status === "Pending" && "Your order is waiting to be processed."}
            {order?.status === "Processing" && "Your order is being prepared for shipment."}
            {order?.status === "Shipped" && "Your order is on the way."}
            {order?.status === "Delivered" && "Your item was delivered successfully."}
            {order?.status === "Cancelled" && "Your order has been cancelled."}
          </p>
        </div>

        {/* Shipping Address */}
        <div className="space-y-1">
          <h3 className="text-md font-semibold">Shipping Address</h3>
          <p className="text-richblack-300 text-sm">{order?.shippingAddress}</p>
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-richblack-200">
          <div>
            <p className="font-semibold text-white">Payment ID</p>
            <p>{order?.paymentId}</p>
          </div>
          <div>
            <p className="font-semibold text-white">Payment Method</p>
            <p>{order?.paymentMethod?.toUpperCase()}</p>
          </div>
          <div>
            <p className="font-semibold text-white">Quantity</p>
            <p>{order?.quantity}</p>
          </div>
          <div>
            <p className="font-semibold text-white">Paid</p>
            <p>{order?.paid ? "Yes ✅" : "No ❌"}</p>
          </div>
        </div>

      <div  className='flex sm:flex-row  gap-4  flex-col'>
          {
            order?.status === "Delivered" && order?.paid && <YellowUnButton onclickHandler={()=>{setReviewModal(true)}} text={"Save Review"}/>
        }
        {
             order?.status === "Delivered" && order?.paid  && !order?.returnStatus && <button disabled={loading} onClick={()=>{returnProductHandler(order?._id)}} className='px-6 py-2  bg-richblack-900 border-[1px] border-richblack-700 text-richblack-5 hover:bg-richblack-800 transition-all duration-300 flex items-center justify-center font-semibold'>Return Product</button>
        }
      </div>
        {
            order?.status !== "Delivered"    &&  order?.status !== "Cancelled" && <button onClick={()=>{cancleOrderHandler(order?._id)}} disabled={loading}  className='px-6 py-2 bg-pink-200  text-richblack-900 hover:bg-pink-400 transition-all duration-300 flex items-center font-semibold  '>Cancel Order</button>
        }
        {
            order?.status === "Cancelled" && order?.paid && <p  className="text-caribbeangreen-100 text-sm">Your order has been cancelled. A refund will be processed within 7 business days by Shopfinity</p>
        }
        {
             order?.status === "Delivered" && order?.paid  && order?.returnStatus && <p  className="text-caribbeangreen-100 text-sm"> Your return request has been received. Shopfinity will process your return within 5-7 business days.</p>
        }
      </div>
      {
        reviewModal && <ReviewModal order={order} setReviewModal={setReviewModal}/>
      }
    
    </div>
  );
};

export default MyOrderDetails;
