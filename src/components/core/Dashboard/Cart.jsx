import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi'
import { BsCartX } from 'react-icons/bs'
import { FaRupeeSign } from 'react-icons/fa'
import { removeFromCart } from '../../../redux/slices/cart'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
    const {productData} = useSelector((state) => state.cart);
    const {totalPrice} = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const removeHandler = (data)=>{
      dispatch(removeFromCart(data));
    }
    
  return (
    <div className="min-h-screen bg-richblack-900 p-4 md:p-8 text-richblack-5">
      <div className="max-w-6xl mx-auto">
       
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-3">
            <FiShoppingCart className="text-yellow-50" />
            Shopping Cart
          </h1>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 text-richblack-100'>
            <p>
              <span className='text-yellow-50'>{productData.length}</span>{" "}
              {productData.length === 1 ? "Item" : "Items"} in Cart
            </p>
            <p className="mt-2 sm:mt-0 flex items-center">
              Total: <span className='text-yellow-50 ml-1 flex items-center'><FaRupeeSign size={12} className="mr-1" />{totalPrice.toFixed(2)}</span>
            </p>
          </div>
          <hr className='border-richblack-700 mt-4'/>
        </div>

      
        {productData.length < 1 ? (
          <div className='flex flex-col items-center justify-center py-16 text-center'>
            <BsCartX className="text-5xl text-richblack-600 mb-4" />
            <h3 className="text-xl font-medium text-richblack-100 mb-2">Your cart is empty</h3>
            <p className="text-richblack-400 max-w-md">
              Your cart is currently empty. Start shopping now and add your favorite items!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
         
            {productData.map((product, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 bg-richblack-800 rounded-lg">
                <div className="sm:w-1/6 cursor-pointer" onClick={()=>{navigate(`/productDetails/${product?._id}`)}}>
                  <img 
                    src={product?.image} 
                    alt="productImage" 
                    className="w-full h-32 object-contain bg-white rounded"
                  />
                </div>
                <div className="sm:w-4/6 cursor-pointer" onClick={()=>{navigate(`/productDetails/${product?._id}`)}}>
                  <h3 className="font-medium">{product?.name}</h3>
                  <p className="text-sm text-richblack-300 mt-1">Brand: {product?.vendor?.storeName}</p>
                  <div className="flex gap-4 mt-3">
                    <div>
                      <p className="text-xs text-richblack-400">Price</p>
                      <p className="text-richblack-100 flex items-center"><FaRupeeSign size={10} className="mr-1" />{product?.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-richblack-400">Discounted</p>
                      <p className="text-yellow-50 flex items-center"><FaRupeeSign size={10} className="mr-1" />{product?.discountedPrice}</p>
                    </div>
                  </div>
                </div>
                <div className="sm:w-1/6 flex sm:justify-end">
                  <button className="text-pink-300 hover:text-pink-200 flex items-center gap-1 text-sm" onClick={()=>{removeHandler(product)}}>
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            ))}

           
            <div className="p-4 bg-richblack-800 rounded-lg border border-richblack-700">
              <div className="flex justify-between items-center">
                <p className="text-richblack-200">Total ({productData.length} items)</p>
                <p className="text-xl font-medium text-yellow-50 flex items-center">
                  <FaRupeeSign size={14} className="mr-1" />{totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart