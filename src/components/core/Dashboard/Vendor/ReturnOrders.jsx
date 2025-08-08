import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Spinner from '../../../common/Spinner';
import { FaRupeeSign, FaCalendarAlt, FaUser, FaBoxOpen, FaChevronDown, FaChevronUp } from 'react-icons/fa';


const ReturnOrders = () => {
    const [allReturnOrders, setAllReturnOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const getAllReturnProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/returnProducts`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            });

            if (!response?.data?.success) {
                throw new Error("Error occur during finding all return products");
            }

            setAllReturnOrders(response?.data?.allReturnOrders);
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    useEffect(() => {
        getAllReturnProducts();
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

    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <div className=" h-full p-4 md:p-8 text-richblack-5">
            {loading ? (
                <div className='flex justify-center items-center h-[calc(100%-64px)]'>
                    <Spinner />
                </div>
            ) : (
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center gap-3">
                        <FaBoxOpen className="text-yellow-50" />
                        Return Orders
                    </h1>

                    {allReturnOrders.length < 1 ? (
                        <div className='flex flex-col justify-center items-center h-[calc(80vh-64px)] text-center'>
                            <FaBoxOpen className="text-5xl text-richblack-600 mb-4" />
                            <h3 className="text-xl font-medium text-richblack-100 mb-2">
                                No Returns Found
                            </h3>
                            <p className="text-richblack-400 max-w-md">
                                No returns so far. That's a good sign! 😄
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {allReturnOrders.map((order) => (
                                <div key={order?._id} className="bg-richblack-800 rounded-lg border border-richblack-700 overflow-hidden">
                                    {/* Summary Card */}
                                    <div 
                                        className="p-4 cursor-pointer flex justify-between items-center hover:bg-richblack-750 transition-colors"
                                        onClick={() => toggleExpand(order?._id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={order?.product?.image} 
                                                alt="productImage" 
                                                className="w-16 h-16 object-contain bg-white rounded"
                                            />
                                            <div>
                                                <h3 className="font-medium">{order?.product?.name}</h3>
                                                <p className="text-sm text-richblack-300">Order ID: #{order?._id?.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                order?.status === 'Returned' ? 'bg-caribbeangreen-900 text-caribbeangreen-100' :
                                                order?.status === 'Processing' ? 'bg-blue-900 text-blue-200' :
                                                'bg-yellow-900 text-yellow-50'
                                            }`}>
                                                {order?.status}
                                            </span>
                                            {expandedOrder === order?._id ? (
                                                <FaChevronUp className="text-richblack-300" />
                                            ) : (
                                                <FaChevronDown className="text-richblack-300" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedOrder === order?._id && (
                                        <div className="p-4 border-t border-richblack-700">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Order Details */}
                                                <div className="space-y-3">
                                                    <h3 className="font-medium text-yellow-50 flex items-center gap-2">
                                                        <FaBoxOpen size={16} />
                                                        Order Details
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="text-sm text-richblack-400">Payment Status</p>
                                                            <p className={order?.paid ? "text-caribbeangreen-100" : "text-pink-200"}>
                                                                {order?.paid ? "Paid" : "Not Paid"}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-richblack-400">Payment Method</p>
                                                            <p className="text-richblack-100">{order?.paymentMethod}</p>
                                                        </div>
                                                        {order?.paymentId && (
                                                            <div className="col-span-2">
                                                                <p className="text-sm text-richblack-400">Payment ID</p>
                                                                <p className="text-richblack-100">{order?.paymentId}</p>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-sm text-richblack-400">Return Quantity</p>
                                                            <p className="text-richblack-100">{order?.quantity}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-richblack-400">Amount Paid</p>
                                                            <p className="text-richblack-100 flex items-center">
                                                                <FaRupeeSign size={12} className="mr-1" />
                                                                {order?.totalPrice?.toFixed(2)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-richblack-400">Order Date</p>
                                                            <p className="text-richblack-100 flex items-center gap-1">
                                                                <FaCalendarAlt size={12} />
                                                                {formatDate(order?.createdAt)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-richblack-400">Return Date</p>
                                                            <p className="text-richblack-100 flex items-center gap-1">
                                                                <FaCalendarAlt size={12} />
                                                                {formatDate(order?.updatedAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Customer Details */}
                                                <div className="space-y-3">
                                                    <h3 className="font-medium text-yellow-50 flex items-center gap-2">
                                                        <FaUser size={16} />
                                                        Customer Details
                                                    </h3>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <p className="text-sm text-richblack-400">Customer Name</p>
                                                            <p className="text-richblack-100">
                                                                {order?.customer?.firstName} {order?.customer?.lastName}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-richblack-400">Email</p>
                                                            <p className="text-richblack-100">{order?.customer?.email}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-richblack-400">Phone Number</p>
                                                            <p className="text-richblack-100">{order?.customer?.phoneNumber}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-richblack-400">Shipping Address</p>
                                                            <p className="text-richblack-100">{order?.shippingAddress}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReturnOrders;