import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Spinner from "../../common/Spinner";
import YellowUnButton from "../../common/YellowUnButton";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";

const MyOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const getStatusMessage = (status) => {
    switch (status) {
      case "Pending":
        return "Your order is waiting to be processed";
      case "Processing":
        return "Your order is being packed";
      case "Shipped":
        return "Your item is on the way";
      case "Delivered":
        return "Your item was delivered successfully";
      case "Cancelled":
        return "As per your request, your item has been cancelled";
      default:
        return "";
    }
  };

  const getAllOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/myOrders`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!response?.data?.success) {
        throw new Error("Error occur during fetching all orders of user");
      }
      setAllOrders(response?.data?.allOrders);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);
  console.log(allOrders);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100%-64px)]">
          <Spinner />
        </div>
      ) : (
        <div>
          {allOrders.length < 1 ? (
            <div className="flex flex-col gap-4 items-center justify-center h-[calc(95vh-64px)]">
              <p>You haven’t placed any orders yet</p>
              <div className="w-fit">
                <YellowUnButton
                  onclickHandler={() => {
                    navigate("/");
                  }}
                  text={" Start Shopping"}
                />
              </div>
            </div>
          ) : (
            <div>
              {/* Page Title */}
              <h2 className="text-3xl font-bold">My Orders</h2>

              {/* products  */}
              <div className="mt-4 flex flex-col gap-4">
                {allOrders.map((product, index) => {
                  return (
                    <div
                      key={index}
                      onClick={()=>{navigate("/my-order-details",{state:{product:product}})}}
                      className="bg-richblack-800 hover:bg-richblack-700 transition-all duration-300 cursor-pointer rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-richblack-700"
                    >
                      {/* Product Image and Name */}
                      <div className="flex items-start gap-4 w-full sm:w-1/2">
                        <img
                          src={product?.product?.image}
                          alt={`${product?.product?.name}Image`}
                          className="w-[80px] h-[80px] object-contain rounded-md bg-richblack-700"
                        />
                        <div>
                          <p className="text-white font-medium">
                            {product?.product?.name.length > 33
                              ? `${product?.product?.name.substring(0, 33)}...`
                              : product?.product?.name}
                          </p>
                          <p className="text-richblack-200 text-sm mt-1">
                            ₹{product?.totalPrice}
                          </p>
                        </div>
                      </div>

                      {/* Status and Date */}
                      <div className="flex flex-col items-start sm:items-end gap-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              product?.status === "Pending"
                                ? "bg-yellow-50"
                                : product?.status === "Processing"
                                ? "bg-blue-200"
                                : product?.status === "Shipped"
                                ? "bg-caribbeangreen-100"
                                : product?.status === "Delivered"
                                ? "bg-caribbeangreen-200"
                                : "bg-pink-200"
                            }`}
                          ></span>
                          <p className="text-white font-semibold">
                            {product?.status} on{" "}
                            {moment(product?.updatedAt).format("ddd MMM DD")}
                          </p>
                        </div>
                        <p className="text-richblack-200 text-xs">
                          {getStatusMessage(product?.status)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MyOrders;
