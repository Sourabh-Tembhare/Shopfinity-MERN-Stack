import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Spinner from '../../../common/Spinner';
import { FaRupeeSign, FaCalendarAlt, FaBoxOpen } from 'react-icons/fa';
import { BsBoxSeam, BsCreditCard } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const OrderReceived = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const getReceivedOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/receivedOrder`, {
        headers: {
          Authorization: 'Bearer ' + token,
        }
      });
      if (!response?.data?.success) {
        throw new Error("Error occur during fetching all received orders");
      }
      setAllOrders(response?.data?.allOrders);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  }

  useEffect(() => {
    getReceivedOrders();
  }, [])

  const formatDate = (dbDate) => {
    return new Date(dbDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  return (
    <div className="min-h-screen bg-richblack-900 p-4 md:p-8 text-richblack-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 flex items-center gap-3">
          <BsBoxSeam className="text-yellow-50" />
          Received Orders
        </h1>

        {loading ? (
          <div className='flex items-center justify-center h-[calc(100vh-200px)]'>
            <Spinner />
          </div>
        ) : (
          <div>
            {allOrders.length < 1 ? (
              <div className='flex flex-col items-center justify-center h-[calc(80vh-64px)] text-center'>
                <FaBoxOpen className="text-5xl text-richblack-600 mb-4" />
                <h3 className="text-xl font-medium text-richblack-100 mb-2">
                  No Orders Received Yet
                </h3>
                <p className="text-richblack-400 max-w-md">
                  You haven't received any orders yet. Once a customer places an order, it will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {allOrders.map((order, index) => (
                  <div key={index} className="p-4 bg-richblack-800 rounded-lg border border-richblack-700 cursor-pointer" onClick={()=>{navigate(`/update-order/${order?._id}`)}}>
                    <div className="flex flex-col md:flex-row gap-6">
                     
                      <div className="w-full md:w-1/5">
                        <img
                          src={order?.product?.image}
                          alt="productImage"
                          className="w-full h-40 object-contain bg-white rounded-lg"
                        />
                      </div>

                    
                      <div className="w-full md:w-3/5 space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">{order?.product?.name}</h3>
                          <p className="text-sm text-richblack-300">Order ID: #{order?._id.slice(-6)}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-richblack-400" />
                            <div>
                              <p className="text-xs text-richblack-400">Order Date</p>
                              <p className="text-richblack-100">{formatDate(order?.createdAt)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <BsBoxSeam className="text-richblack-400" />
                            <div>
                              <p className="text-xs text-richblack-400">Quantity</p>
                              <p className="text-richblack-100">{order?.quantity}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <FaRupeeSign className="text-richblack-400" />
                            <div>
                              <p className="text-xs text-richblack-400">Product Price</p>
                              <p className="text-richblack-100">{order?.product?.price}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <BsCreditCard className="text-richblack-400" />
                            <div>
                              <p className="text-xs text-richblack-400">Payment Status</p>
                              <p className={`${order?.paid ? 'text-caribbeangreen-100' : 'text-pink-200'}`}>
                                {order?.paid ? "Paid" : "Not Paid"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                    
                      <div className="w-full md:w-1/5 flex md:justify-end">
                        <div className="bg-richblack-700 p-3 rounded-lg w-full md:w-auto">
                          <p className="text-xs text-richblack-400">Total Amount</p>
                          <p className="text-xl font-medium text-yellow-50 flex items-center">
                            <FaRupeeSign size={14} className="mr-1" />
                            {order?.totalPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderReceived