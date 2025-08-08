import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { calculateAverageRating } from '../../../utils/CalculateAverageRating'
import ReactStars from 'react-stars'

const CategoryProductCard = ({ productDataH,productNameH }) => {
  const location = useLocation();
  const [productName,setProductName] = useState("");
  const [productData,setProducData] = useState([]);
useEffect(() => {
  if (location.state?.productData || location.state?.productName) {
    setProductName(location.state?.productName);
    setProducData(location.state?.productData);
  } else {
    setProductName(productNameH);
    setProducData(productDataH);
  }
}, [location.state, productDataH, productNameH]);

  const navigate = useNavigate();
 

  return (
    <div className={`${ location.state?.productData ||  location.state?.productName ? "py-8 px-4 sm:px-6 lg:px-8 text-richblack-5" :"py-8 text-richblack-5"}`}>
      <h2 className='sm:text-3xl text-2xl font-semibold mb-6 text-yellow-50  max-w-7xl mx-auto'>{productName}</h2>

      {productData?.length < 1 ? (
        <div className='text-richblack-5 text-[18px] sm:text-3xl flex justify-center items-center mt-36'>
          Products not available
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto'>
          {productData?.map((product, index) => (
            <div
              key={index}
              className='bg-richblack-800 rounded-lg border border-richblack-700 hover:shadow-lg transition-shadow duration-300 cursor-pointer'
              onClick={()=>{navigate(`/productDetails/${product?._id}`)}}
            >
              {/* Product Image */}
              <div className='relative pb-[100%] overflow-hidden'>
                <img
                  src={product?.image}
                  alt={product?.name}
                  className='absolute top-0 left-0 w-full h-full object-contain p-4 bg-richblack-900'
                />
                {product?.discount > 0 && (
                  <div className='absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded'>
                    {product?.discount}% OFF
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className='p-3 flex flex-col gap-2'>
                <h3 className='text-richblack-5 font-semibold text-base line-clamp-1'>{product?.name}</h3>

                <p className='text-richblack-100 text-xs line-clamp-2 min-h-[2.5rem]'>
                  {product?.description}
                </p>

                <div className='flex items-center gap-1'>
                  <ReactStars
                    count={5}
                    value={calculateAverageRating(product?.reviews)}
                    edit={false}
                    size={16}
                    color2={'#FFD60A'} 
                  />
                  <span className='text-yellow-50 text-xs'>({product?.reviews?.length || 0})</span>
                </div>

                <div className='flex items-center gap-2'>
                  {product?.discount > 0 ? (
                    <>
                      <span className='text-richblack-300 line-through text-sm'>
                        ₹{product?.price.toFixed(2)}
                      </span>
                      <span className='text-yellow-50 font-bold text-lg'>
                        ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className='text-yellow-50 font-bold text-lg'>
                      ₹{product?.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <span
                  className={`text-xs font-medium ${
                    product?.stock > 5 ? 'text-caribbeangreen-100' : 'text-pink-200'
                  }`}
                >
                  {product?.stock > 0 ? `${product?.stock} left` : 'Out of stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryProductCard
