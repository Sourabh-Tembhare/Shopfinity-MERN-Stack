import React, { useState } from "react";
import {
  FaHome,
  FaShoppingCart,
  FaUserCircle,
  FaCog,
  FaTruck,
  FaUndoAlt ,
  FaThList,
  FaPlus,
  FaBoxes
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal";
import { CiLogout } from "react-icons/ci";
import { removeToken } from "../../../redux/slices/auth";
import { removeProfile } from "../../../redux/slices/profile";
import toast from "react-hot-toast";

const sidebarLinks = [

  {
    title: " My Profile",
    icon: <FaUserCircle />,
    path: "/dashboard",
    accountType: "all",
  },
  {
    title: "My Orders",
    icon: <FaThList />,
    path: "/dashboard/my-orders",
    accountType: "all",
  },
  {
    title: "Cart",
    icon: <FaShoppingCart />,
    path: "/dashboard/mycart",
    accountType: "all",
  },

  
  {
    title: "Dashboard",
    icon: <FaHome />,
    path: "/dashboard/details",
    accountType: "vendor",
  },
  {
    title: "Add Product",
    icon: <FaPlus/>,
    path: "/dashboard/add-products",
    accountType: "vendor",
  },
  {
    title: "My Products",
    icon: <FaBoxes/>,
    path: "/dashboard/my-products",
    accountType: "vendor",
  },
  {
    title: "Orders Received",
    icon: <FaTruck />,
    path: "/dashboard/order-received",
    accountType: "vendor",
  },

  {
    title: "Return Orders",
    icon: <FaUndoAlt  tar />,
    path: "/dashboard/return-orders",
    accountType: "vendor",
  },

  {
    title: "Store Settings",
    icon: <FaCog />,
    path: "/dashboard/vendor-profile-settings",
    accountType: "vendor",
  },

 

  {
    title: " Profile Settings",
    icon: <FaCog />,
    path: "/dashboard/settings",
    accountType: "all",
  },
];

const SideNav = () => {
  const { userProfile } = useSelector((state) => state.profile);
  const location = useLocation();
  const [confirmToggle, setConfirmToggle] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {token} = useSelector((state) => state.auth);

  const logOutHandler = () => {
       navigate("/login");
    dispatch(removeToken());
    dispatch(removeProfile());
    toast.success("Logout Successfully");
  };
  return (
    <div className="bg-richblack-800 w-full h-[100%] flex flex-col gap-4 overflow-y-auto">
      { userProfile && sidebarLinks
        .filter(
          (data) =>
            data.accountType === userProfile.accountType ||
            data.accountType === "all"
        )
        .map((item, index) => {
          return (
            <Link
              to={item.path}
              key={index}
              className={`flex gap-2 py-2 flex-row items-center pl-4 ${
                item.path === location.pathname
                  ? "bg-yellow-800 text-yellow-50 border-l-[4px] border-yellow-50"
                  : "text-richblack-200"
              }`}
            >
              {item.icon}
              <p>{item.title}</p>
            </Link>
          );
        })}
{
  token &&       <div
        className="flex items-center font-semibold gap-2 py-2 flex-row  pl-4 text-richblack-200 cursor-pointer"
        onClick={() => {
          setConfirmToggle(true);
      
        }}
      >
        <CiLogout size={20}/>
        <p>Logout</p>
      </div>
}
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
    </div>
  );
};

export default SideNav;
