import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../common/Spinner';
import { useNavigate } from 'react-router-dom';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { setProductData } from '../../../../redux/slices/productEdit';
import ConfirmationModal from '../../../common/ConfirmationModal';

const MyProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [productId, setProductId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const vendorAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/vendorAllProducts`, {
        headers: {
          Authorization: 'Bearer ' + token,
        }
      });

      if (!response?.data?.success) {
        throw new Error("Error occurred during fetching vendor products");
      }
      setAllProducts(response?.data?.allProducts);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    vendorAllProducts();
  }, []);

  const editHandler = (productData) => {
    dispatch(setProductData(productData));
    navigate("/edit-product", {
      state: { fromMyProducts: true }
    });
  };

  const deleteConfirm = (product, category) => {
    setConfirmToggle(true);
    setProductId(product);
    setCategoryId(category);
  };

  const deleteHandler = async (productId, categoryId) => {
    const data = {
      productId: productId,
      categoryId: categoryId,
    };
    try {
      setConfirmToggle(false);
      setLoading(true);
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/deleteProduct`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        data: data
      });

      if (!response?.data?.success) {
        throw new Error("Error occurred during deleting product");
      }

      toast.success(response?.data?.message);
      vendorAllProducts();
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {loading ? (
        <div className='flex items-center justify-center h-[calc(100%-64px)]'>
          <Spinner />
        </div>
      ) : (
        <div className='w-full p-4'>
          {allProducts.length === 0 ? (
            <div className='text-center text-xl text-richblack-200'>
              <p>
                No products found. Click{' '}
                <span
                  className='text-yellow-50 cursor-pointer underline'
                  onClick={() => navigate("/dashboard/add-products")}
                >
                  Add Product
                </span>{' '}
                to get started.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
              {allProducts.map((product, index) => (
                <div
                  key={index}
                  className='bg-richblack-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col'
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading='lazy'
                    className='w-full h-40 object-cover rounded-lg mb-4'
                  />

                  <h3 className='text-lg font-semibold text-richblack-5 mb-1 truncate'>{product.name}</h3>
                  <p className='text-sm text-richblack-300 mb-1'>Stock: {product.stock}</p>

                  <div className='text-richblack-100 mb-1 flex items-center gap-1'>
                    <LiaRupeeSignSolid className='text-xl' />
                    <span>{product.price}</span>
                  </div>

                  {product.discount > 0 && (
                    <>
                      <p className="text-sm text-yellow-300 mb-1">
                        Discount: {product.discount}%
                      </p>
                      <p className="text-sm text-green-400 mb-3">
                        Final Price: ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </p>
                    </>
                  )}

                  <div className='mt-auto flex gap-4 justify-end text-xl'>
                    <MdOutlineEdit
                      className='hover:text-blue-300 cursor-pointer transition-all'
                      title="Edit"
                      onClick={() => { editHandler(product) }}
                    />
                    <MdOutlineDelete
                      onClick={() => { deleteConfirm(product._id, product.category) }}
                      className='hover:text-pink-300 cursor-pointer transition-all'
                      title="Delete"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {confirmToggle && (
        <ConfirmationModal
          btn1={"Cancel"}
          btn2={"Delete"}
          heading={"Delete Product"}
          desc={"Are you sure you want to delete this product? This action cannot be undone."}
          onclick={() => { deleteHandler(productId, categoryId) }}
          setConfirmToggle={setConfirmToggle}
        />
      )}
    </>
  );
};

export default MyProducts;
