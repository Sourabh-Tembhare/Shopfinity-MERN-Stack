import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Home from './pages/Home'
import  "./App.css"
import Login from './pages/Login'
import SignUp from './pages/Signup'
import { Toaster } from 'react-hot-toast'
import Otp from './components/auth/Otp'
import ForgotPassword from './components/auth/ForgotPassword'
import Dashboard from './pages/Dashboard'
import MyProfile from './components/core/Dashboard/MyProfile'
import ProfileSettings from './components/core/Dashboard/ProfileSettings'
import VendorProfileSettings from './components/core/Dashboard/Vendor/VendorProfileSettings'
import AddProduct from './components/core/Dashboard/Vendor/AddProduct'
import MyProducts from './components/core/Dashboard/Vendor/MyProducts'
import CategoryDetails from './pages/CategoryDetails'
import CategoryProductCard from './components/core/Category/CategoryProductCard'
import ProductDetails from './pages/ProductDetails'
import BuyNowInformation from './components/core/Product/BuyNowInformation'
import Error from './pages/Error'
import MyOrders from './components/core/Dashboard/MyOrders'
import MyOrderDetails from './components/core/Dashboard/MyOrderDetails'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Cart from './components/core/Dashboard/Cart'
import OrderReceived from './components/core/Dashboard/Vendor/OrderReceived'
import UpdateOrder from './components/core/Dashboard/Vendor/UpdateOrder'
import ReturnOrders from './components/core/Dashboard/Vendor/ReturnOrders'
import VendorDashboard from './components/core/Dashboard/Vendor/VendorDashboard'

const App = () => {

  const router = createBrowserRouter([
    {path:"/",element:<><Navbar/><Home/></>},
    {path:"/login",element:<><Navbar/><Login/></>},
    {path:"/signup",element:<><Navbar/><SignUp/></>},
    {path:"/otp",element:<><Navbar/><Otp/></>},
    {path:"/forgot-password",element:<><Navbar/><ForgotPassword/></>},
    {path:"/dashboard",element:<><Navbar/><Dashboard/></>,children:[
      {path:"",element:<><MyProfile/></>},
      {path:"settings",element:<><ProfileSettings/></>},
      {path:'vendor-profile-settings',element:<><VendorProfileSettings/></>},
      {path:"add-products",element:<><AddProduct/></>},
      {path:"my-products",element:<><MyProducts/></>},
      {path:"my-orders",element:<><MyOrders/></>},
      {path:"mycart",element:<><Cart/></>},
      {path:"order-received",element:<><OrderReceived/></>},
      {path:"return-orders",element:<><ReturnOrders/></>},
      {path:"details",element:<><VendorDashboard/></>}
    ]},
    {path:"/edit-product",element:<><Navbar/><AddProduct/></>},
    {path:"/category-details/:categoryId",element:<><Navbar/><CategoryDetails/></>},
    {path:"/categopry-product-card",element:<><Navbar/><CategoryProductCard/></>},
    {path:"/productDetails/:productId",element:<><Navbar/><ProductDetails/></>},
    {path:"/buy-now-information",element:<><Navbar/><BuyNowInformation/></>},
    {path:"/my-order-details",element:<><Navbar/><MyOrderDetails/></>},
    {path:"*",element:<><Error/></>},
    {path:'/aboutUs',element:<><Navbar/><AboutUs/></>},
    {path:"/contactUs",element:<><Navbar/><ContactUs/></>},
    {path:'/update-order/:orderId',element:<><Navbar/><UpdateOrder/></>}
  
  ])
  return (
    <div className='font-inter min-h-screen w-screen  bg-richblack-900 overflow-x-hidden'>
  <RouterProvider  router={router}/>
  <Toaster/>
    </div>
  )
}

export default App