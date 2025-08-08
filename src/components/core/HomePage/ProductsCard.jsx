import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ReactStars from "react-stars";
import { calculateAverageRating } from "../../../utils/CalculateAverageRating";
import { useNavigate } from "react-router-dom";

const ProductsCard = ({ data, name }) => {
  const navigate = useNavigate();
  return (
    <div className="text-white cursor-pointer">
      <h2 className="text-3xl font-semibold text-richblack-5 mb-6">{name}</h2>

      <Swiper
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 1.2 },   
          640: { slidesPerView: 2.2 },  
          768: { slidesPerView: 3 },     
          1024: { slidesPerView: 4 },   
        }}
      >
        {data.map((product, index) => {
          const finalPrice = (
            product.price *
            (1 - product.discount / 100)
          ).toFixed(2);

          return (
            <SwiperSlide key={index} onClick={()=>{navigate(`/productDetails/${product?._id}`)}}>
              <div className="bg-richblack-800 min-h-[320px] rounded-md border border-richblack-700 hover:border-richblue-200 transition duration-200 p-2 flex flex-col">
                
                {/* Product Image */}
                <div className="h-40 md:h-48 w-full flex items-center justify-center mb-3">
                  <img
                    src={product?.image}
                    alt={`${product?.name}Image`}
                    className="max-h-full object-contain rounded-md"
                  />
                </div>

                {/* Product Name */}
                <p className="text-richblack-5 font-medium text-sm line-clamp-2">
                  {product?.name}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 my-1">
                  <ReactStars
                    count={5}
                    value={calculateAverageRating(product?.reviews)}
                    edit={false}
                    size={16}
                    color2={"#FFD60A"}
                  />
                  <span className="text-yellow-50 text-xs">
                    ({product?.reviews?.length || 0})
                  </span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-lg">
                    ₹{finalPrice}
                  </span>
                  {product.discount > 0 && (
                    <>
                      <span className="text-richblack-100 line-through text-sm">
                        ₹{product.price}
                      </span>
                      <span className="text-caribbeangreen-100 text-sm font-semibold">
                        {product.discount}% off
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Info */}
                <div className="mt-auto text-xs font-medium text-end">
                  {product?.stock > 5 ? (
                    <span className="text-caribbeangreen-100">
                      {product?.stock} left
                    </span>
                  ) : product?.stock > 0 ? (
                    <span className="text-yellow-300">
                      Only {product?.stock} left
                    </span>
                  ) : (
                    <span className="text-pink-200">Out of stock</span>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ProductsCard;
