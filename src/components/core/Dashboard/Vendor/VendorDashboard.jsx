import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Spinner from "../../../common/Spinner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const VendorDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [monthlySales, setMonthlySales] = useState(0);
  const [showAllDelivered, setShowAllDelivered] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);

  const getDashboardDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/dashboardDetails`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!response?.data?.success) {
        throw new Error("Error fetching vendor dashboard details");
      }

      setTotalSales(response?.data?.totalSales);
      setTotalOrders(response?.data?.totalOrders);
      setPendingOrders(response?.data?.pendingOrders);
      setTotalProducts(response?.data?.totalProducts);
      setDeliveredOrders(response?.data?.deliveredOrders);
      setMonthlySales(response?.data?.monthlySales);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardDetails();
  }, []);


  const chartData = totalProducts.map((product) => {
    const priceAfterDiscount =
      product.price - (product.price * product.discount) / 100;
    const income = priceAfterDiscount * (product.totalBuyers?.length || 0);
    return {
      name: product.name.length > 10 ? product.name.slice(0, 10) + "..." : product.name,
      income: Number(income.toFixed(2)),
    };
  });


  const formatPrice = (value) =>
    `₹${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className=" text-richblack-5">
      {loading ? (
        <div className="flex justify-center items-center h-[calc(95vh-64px)]">
          <Spinner />
        </div>
      ) : (
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold">
                Welcome, {userProfile?.firstName}
              </h1>
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-richblack-300 mt-1">
              Here's your business overview
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard 
              label="Total Sales" 
              value={formatPrice(totalSales)}
              icon="₹"
              color="border-caribbeangreen-300"
            />
            <StatCard 
              label="Total Orders" 
              value={totalOrders}
              icon="📦"
              color="border-blue-300"
            />
            <StatCard 
              label="Pending Orders" 
              value={pendingOrders}
              icon="⏳"
              color="border-yellow-300"
            />
            <StatCard 
              label="Products Listed" 
              value={totalProducts.length}
              icon="🛍️"
              color="border-pink-300"
            />
            <StatCard 
              label="Monthly Sales" 
              value={formatPrice(monthlySales)}
              icon="📆"
              color="border-richblue-300"
            />
          </div>

          {/* Chart Section */}
          <div className="bg-richblack-800 rounded-xl p-6 mb-8 shadow-lg border border-richblack-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Product Revenue</h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-caribbeangreen-300"></div>
                <span className="text-sm text-richblack-200">Income (₹)</span>
              </div>
            </div>
            
            {chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="incomeColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06D6A0" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06D6A0" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#2C333F" 
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="name" 
                      stroke="#AFB2BF"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#AFB2BF"
                      tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [formatPrice(value), 'Income']}
                      contentStyle={{
                        backgroundColor: '#000814',
                        borderColor: '#2C333F',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#06D6A0"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#incomeColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-richblack-300">
                No product data available
              </div>
            )}
          </div>

          {/* Orders Section */}
          <div className="bg-richblack-800 rounded-xl p-6 shadow-lg border border-richblack-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              {deliveredOrders.length > 3 && (
                <button
                  onClick={() => setShowAllDelivered(!showAllDelivered)}
                  className="text-sm px-4 py-2 bg-richblack-700 hover:bg-richblack-600 rounded-lg transition"
                >
                  {showAllDelivered ? 'Show Less' : 'Show All'}
                </button>
              )}
            </div>

            {deliveredOrders.length < 1 ? (
              <div className="text-center py-8 text-richblack-300">
                No delivered orders found
              </div>
            ) : (
              <div className="space-y-4">
                {(showAllDelivered ? deliveredOrders : deliveredOrders.slice(0, 3)).map((order, index) => (
                  <OrderCard 
                    key={index}
                    image={order?.product?.image}
                    name={order?.product?.name}
                    quantity={order?.quantity}
                    totalPrice={order?.totalPrice}
                    date={order?.createdAt}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-richblack-800 p-4 rounded-xl border-l-4 ${color} shadow hover:shadow-lg transition`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-richblack-300 text-sm">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);


const OrderCard = ({ image, name, quantity, totalPrice, date }) => (
  <div className="flex items-center p-4 bg-richblack-700 rounded-lg hover:bg-richblack-600 transition">
    <img
      src={image}
      alt={name}
      className="w-16 h-16 object-cover rounded-lg mr-4"
    />
    <div className="flex-1 min-w-0">
      <h3 className="font-medium truncate">{name}</h3>
      <p className="text-richblack-300 text-sm mt-1">
        {new Date(date).toLocaleDateString()}
      </p>
    </div>
    <div className="text-right">
      <p className="font-semibold">
        ₹{Number(totalPrice).toLocaleString('en-IN')}
      </p>
      <p className="text-richblack-300 text-sm">Qty: {quantity}</p>
    </div>
  </div>
);

export default VendorDashboard;