import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaStar, FaRegStar, FaChevronDown, FaChevronUp, FaUser } from 'react-icons/fa';

const RatingAndReview = ({ productId }) => {
    const [loading, setLoading] = useState(false);
    const [allReviews, setAllReviews] = useState([]);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [expandedImage, setExpandedImage] = useState(null);

    const getProductReviews = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getProductReviews/${productId}`)
            if (!response?.data?.success) {
                throw new Error("Error occur during fetching all reviews of a particular product");
            }
            setAllReviews(response?.data?.allReviews);
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false)
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    useEffect(() => {
        getProductReviews();
    }, [productId])

    const ratingText = (rating) => {
        switch (rating) {
            case 1: return "Very Bad";
            case 2: return "Bad";
            case 3: return "Good";
            case 4: return "Very Good";
            case 5: return "Brilliant";
            default: return "";
        }
    }


    const displayReviews = showAllReviews ? allReviews : allReviews.slice(0, 2);

    return (
        <div className="bg-richblack-800 p-4 rounded-lg mt-4">
            {loading ? (
                <div className='text-center text-richblack-100'>Loading...</div>
            ) : (
                <div>
                    {allReviews.length < 1 ? (
                        <div className='text-center text-richblack-100'>
                            No ratings or reviews available for this product
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                {displayReviews.map((review, index) => (
                                    <div key={index} className="border-b border-richblack-700 pb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex text-yellow-50">
                                                {[...Array(5)].map((_, i) => (
                                                    i < review?.rating ? 
                                                    <FaStar key={i} /> : 
                                                    <FaRegStar key={i} />
                                                ))}
                                            </div>
                                            <span className="text-sm text-richblack-300">
                                                {ratingText(review?.rating)}
                                            </span>
                                        </div>

                                        {review?.comment && (
                                            <p className="text-richblack-100 mb-3">{review?.comment}</p>
                                        )}

                                        {review?.reviewFile && (
                                            <div className="mb-3">
                                                <img 
                                                    src={review?.reviewFile} 
                                                    alt="review" 
                                                    className="h-20 w-20 object-cover rounded cursor-pointer"
                                                    onClick={() => setExpandedImage(review?.reviewFile)}
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-sm text-richblack-300">
                                            <FaUser className="text-richblack-400" />
                                            <span>
                                                {review?.customer?.firstName}
                                            </span>
                                            <span>•</span>
                                            <span>Certified Buyer</span>
                                            <span>•</span>
                                            <span>{new Date(review?.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                          
                            {allReviews.length > 2 && (
                                <button 
                                    className="flex items-center gap-1 text-yellow-50 text-sm"
                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                >
                                    {showAllReviews ? (
                                        <>
                                            <FaChevronUp size={12} />
                                            Show Less Reviews
                                        </>
                                    ) : (
                                        <>
                                            <FaChevronDown size={12} />
                                            Show All Reviews ({allReviews.length})
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

           
            {expandedImage && (
                <div 
                    className="fixed inset-0 bg-richblack-900 bg-opacity-90 flex items-center justify-center z-50 p-4"
                    onClick={() => setExpandedImage(null)}
                >
                    <div className="max-w-4xl max-h-[90vh]">
                        <img 
                            src={expandedImage} 
                            alt="expanded review" 
                            className="max-w-full max-h-[80vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default RatingAndReview