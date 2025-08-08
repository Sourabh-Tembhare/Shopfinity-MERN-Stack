import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { useNavigate } from 'react-router-dom';

const AllCategory = () => {
    const [loading, setLoading] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const navigate = useNavigate();

    const getAllCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getAllCategories`);
            if (!response?.data?.success) {
                throw new Error("Error occurred while fetching all categories");
            }
            setAllCategories(response.data.allCategories);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    return (
        <div className="py-8">
            <h2 className='text-2xl md:text-3xl font-bold text-center mb-6 text-richblack-25'>
                Top Categories
            </h2>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-richblack-800 rounded-lg h-32 animate-pulse"></div>
                    ))}
                </div>
            ) : allCategories.length < 1 ? (
                <div className="text-center py-8 text-richblack-300">
                    No categories found
                </div>
            ) : (
                <Swiper
                    spaceBetween={16}
                    slidesPerView={'auto'}
                    freeMode={true}
                    grabCursor={true}
                    className="!overflow-visible"
                    breakpoints={{
                        640: { spaceBetween: 20 },
                        1024: { spaceBetween: 24 }
                    }}
                >
                    {allCategories.map((category, index) => (
                        <SwiperSlide
                            key={index}
                            className="!w-auto cursor-pointer"
                            onClick={() => navigate(`/category-details/${category?._id}`)}
                        >
                            <div className="group w-36 sm:w-40 md:w-48 lg:w-52 xl:w-56 flex flex-col items-center p-3 bg-richblack-800 hover:bg-richblack-700 rounded-lg shadow-md transition duration-300">
                                <div className="w-full h-28 sm:h-32 md:h-36 lg:h-40 rounded overflow-hidden bg-richblack-700 flex items-center justify-center">
                                    <img
                                        src={category?.image}
                                        alt={category?.name}
                                        className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="mt-2 text-center">
                                    <h3 className="text-sm sm:text-base font-medium text-white truncate">
                                        {category?.name}
                                    </h3>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}

export default AllCategory;
