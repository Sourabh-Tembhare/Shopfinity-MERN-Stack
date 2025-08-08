import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Spinner from '../../../common/Spinner';
import { FaRupeeSign, FaCalendarAlt, FaBox, FaUser } from 'react-icons/fa';

const UpdateOrder = () => {
    const [loading, setLoading] = useState(false);
    const [orderDetails, setOrderDetails] = useState({});
    const params = useParams();
    const orderId = params.orderId;
    const { token } = useSelector((state) => state.auth);
    const [statusLoading, setStatusLoading] = useState(false);

  
    const statusOrder = ['Pending', 'Processing', 'Shipped', 'Delivered'];

    const calculateDiscountedPrice = (price, discount) => {
        if (!price || !discount) return 0;
        return price - (price * discount / 100);
    };

    const getOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/orderDetails/${orderId}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            });
            if (!response?.data?.success) {
                throw new Error("Error occurred during fetching orderDetails");
            }
            setOrderDetails(response?.data?.orderDetails);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        getOrderDetails();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const updateOrderStatus = async (newStatus) => {
       
        const currentStatusIndex = statusOrder.indexOf(orderDetails?.status);
        const newStatusIndex = statusOrder.indexOf(newStatus);
        
        if (newStatusIndex < currentStatusIndex) {
            toast.error(`Cannot revert status from ${orderDetails?.status} to ${newStatus}`);
            return;
        }

        try {
            setStatusLoading(true);
            const response = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/update-order`,
                {
                    status: newStatus,
                    orderId: orderDetails?._id,
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    }
                }
            );
            
            if (!response?.data?.success) {
                throw new Error("Error occurred during updating order status");
            }
            
            toast.success(response?.data?.message);
            getOrderDetails();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setStatusLoading(false);
        }
    };

    const discountedPrice = calculateDiscountedPrice(
        orderDetails?.product?.price,
        orderDetails?.product?.discount
    );

    return (
        <div className="min-h-screen bg-richblack-900 p-4 md:p-8 text-richblack-5">
            {loading ? (
                <div className='flex items-center justify-center h-[calc(95vh-64px)]'>
                    <Spinner />
                </div>
            ) : (
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center gap-3">
                        <FaBox className="text-yellow-50" />
                        Order Details
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Product Information */}
                        <div className="lg:col-span-1 bg-richblack-800 p-4 rounded-lg border border-richblack-700">
                            <h2 className="text-xl font-medium mb-4 pb-2 border-b border-richblack-700">Product Details</h2>
                            <div className="flex flex-col items-center mb-4">
                                <img
                                    src={orderDetails?.product?.image}
                                    alt="productImage"
                                    loading='lazy'
                                    className="w-full h-48 object-contain bg-white rounded-lg mb-4"
                                />
                                <h3 className="text-lg font-medium text-center">{orderDetails?.product?.name}</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-richblack-300">Price:</span>
                                    <span className="flex items-center">
                                        <FaRupeeSign size={12} className="mr-1" />
                                        {orderDetails?.product?.price?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-richblack-300">Discount:</span>
                                    <span>{orderDetails?.product?.discount || '0'}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-richblack-300">Discounted Price:</span>
                                    <span className="flex items-center text-yellow-50">
                                        <FaRupeeSign size={12} className="mr-1" />
                                        {discountedPrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
                                <h2 className="text-xl font-medium mb-4 pb-2 border-b border-richblack-700">Order Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-richblack-400">Order ID</p>
                                        <p className="text-richblack-100">#{orderDetails?._id?.slice(-6).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-richblack-400">Quantity</p>
                                        <p className="text-richblack-100">{orderDetails?.quantity}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-richblack-400">Total Amount</p>
                                        <p className="text-richblack-100 flex items-center">
                                            <FaRupeeSign size={12} className="mr-1" />
                                            {orderDetails?.totalPrice?.toFixed(2) || '0.00'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-richblack-400">Payment Method</p>
                                        <p className="text-richblack-100">{orderDetails?.paymentMethod}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-richblack-400">Payment Status</p>
                                        <p className={orderDetails?.paid ? "text-caribbeangreen-100" : "text-pink-200"}>
                                            {orderDetails?.paid ? "Paid" : "Not Paid"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-richblack-400">Shipping Address</p>
                                        <p className="text-richblack-100">{orderDetails?.shippingAddress}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-richblack-400">Order Date</p>
                                        <p className="text-richblack-100 flex items-center gap-1">
                                            <FaCalendarAlt size={12} />
                                            {formatDate(orderDetails?.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-richblack-400">Last Updated</p>
                                        <p className="text-richblack-100 flex items-center gap-1">
                                            <FaCalendarAlt size={12} />
                                            {formatDate(orderDetails?.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
                                <h2 className="text-xl font-medium mb-4 pb-2 border-b border-richblack-700 flex items-center gap-2">
                                    <FaUser size={18} />
                                    Customer Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-richblack-400">Customer Name</p>
                                        <p className="text-richblack-100">
                                            {orderDetails?.customer?.firstName} {orderDetails?.customer?.lastName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-richblack-400">Email</p>
                                        <p className="text-richblack-100">{orderDetails?.customer?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-richblack-400">Phone Number</p>
                                        <p className="text-richblack-100">{orderDetails?.customer?.phoneNumber}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status */}
                            <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
                                <h2 className="text-xl font-medium mb-4 pb-2 border-b border-richblack-700">Update Order Status</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {statusOrder.map((status) => {
                                        const currentStatusIndex = statusOrder.indexOf(orderDetails?.status);
                                        const statusIndex = statusOrder.indexOf(status);
                                        const isCompleted = statusIndex < currentStatusIndex;
                                        const isCurrent = statusIndex === currentStatusIndex;
                                        const isNext = statusIndex === currentStatusIndex + 1;
                                        const isDisabled = !(isCompleted || isCurrent || isNext);

                                        return (
                                            <label 
                                                key={status}
                                                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${
                                                    isCurrent ? 'bg-richblack-700' : 
                                                    isCompleted ? 'bg-caribbeangreen-900' : 'bg-richblack-900'
                                                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className={`form-checkbox h-5 w-5 rounded ${
                                                        isCurrent ? 'text-yellow-50' : 
                                                        isCompleted ? 'text-caribbeangreen-100' : 'text-richblack-400'
                                                    }`}
                                                    checked={isCompleted || isCurrent}
                                                    onChange={() => !isDisabled && updateOrderStatus(status)}
                                                    disabled={isDisabled || statusLoading}
                                                />
                                                <span className={isCompleted ? 'text-caribbeangreen-100' : ''}>
                                                    {status}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateOrder;