import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../common/Spinner";
import MediaPicker from "../../../common/MediaPicker";
import Tag from "./Tag";
import { useLocation, useNavigate } from "react-router-dom";
import { removeProductData } from "../../../../redux/slices/productEdit";

function arraysAreSameItems(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;

  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();

  return sorted1.every((val, index) => val === sorted2[index]);
}
 
const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [verify, setVerify] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { productData } = useSelector((state) => state.product);
  const [category, setCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [allTag, setAllTag] = useState([]);
  const navigate = useNavigate();
  const [updateImage,setUpdateImage] = useState(null);
  const location = useLocation();
  const fromMyProducts = location.state?.fromMyProducts;
  const disapatch = useDispatch();
  const [formData,setFormData] = useState({
    name : "", 
    description : "",
    categoryId : "",
    price : "",
    stock:"",
    discount:""
  });

  const onChangeHandler = (event)=>{
    const {name,value} = event.target;
    setFormData(prev => {
        return {
            ...prev ,
            [name] : value
        }
    })
  }

  const profileVerifyCheck = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/profileVerifyCheck`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!response?.data?.success) {
        throw new Error(
          "Error occur during checking profile is verified or not"
        );
      }
      setVerify(response?.data.verified);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went  wrong");
    }
  };

  const getAllCategories = async () => {
    try {
      setCategoryLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/getAllCategories`
      );
      if (!response?.data?.success) {
        throw new Error("Error occur during fetch categorirs");
      }
      setCategory(response.data.allCategories);
      setCategoryLoading(false);
    } catch (error) {
      console.log(error);
      setCategoryLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    profileVerifyCheck();
    getAllCategories();
    if(fromMyProducts && productData){
      formData.name = productData?.name || "";
      formData.description = productData?.description || "";
      formData.categoryId = productData?.category || "";
      formData.price = productData?.price || "";
      formData.stock = productData?.stock || "";
      formData.discount = productData?.discount || "";
      
     if (productData?.tag) {
  try {
    setAllTag(Array.isArray(productData.tag) ? productData.tag : JSON.parse(productData.tag));
  } catch (e) {
    console.error("Tag parsing failed", e);
    setAllTag([]);  // fallback
  }
}

      setUpdateImage(productData?.image);
      
      
    }
  }, []);

  const productCreatehandler = async(e)=>{
    e.preventDefault();
        if(formData.stock <1){
      toast.error("Stock must be at least 1")
      return ;
    }
    if(formData.discount <0 || formData.discount >100){
  toast.error("Discount must be between 0 and 100%");
  return ;
    }

    if(!formData.categoryId){
        toast.error("Please select a product category");
        return ;
    }
        if(imageUrl === null){
        toast.error("Please upload a product image before proceeding");
        return ; 
    }
    if(allTag.length < 2){
        toast.error("Please add at least two tags to help customers discover your product");
        return ;
    }

    const data = new FormData();
    data.append("name",formData.name);
    data.append("description",formData.description);
    data.append("price",formData.price);
    data.append("stock",formData.stock);
    data.append("categoryId",formData.categoryId);
    data.append("discount",formData.discount);
    data.append("tag",JSON.stringify(allTag));
    data.append("image",imageUrl);
   
    try {
    setLoading(true);;
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/createProduct`,data,{
        headers:{
            Authorization:"Bearer "+token
        }
    });
    if(!response?.data?.success){
        throw new Error("Error occur during creating product");
    }
    toast.success(response.data.message);
    setLoading(false);
    navigate("/dashboard/my-products");
        
    } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(error.response?.data?.message || "Something went wrong");       
    }
  }
  const productEdithandler = async(e)=>{
  e.preventDefault();
      e.preventDefault();
    if(!formData.categoryId){
        toast.error("Please select a product category");
        return ;
    }
    if(allTag.length < 2){
        toast.error("Please add at least two tags to help customers discover your product");
        return ;
    }
    if(formData.stock <1){
      toast.error("Stock must be at least 1")
      return ;
    }
    if(formData.discount <0 || formData.discount >100){
  toast.error("Discount must be between 0 and 100%");
  return ;
    }

    if(formData.categoryId === productData?.category && formData.description === productData?.description && formData.name ===  productData?.name
    &&  formData.price ===  productData?.price && formData.discount === productData?.discount  && formData.stock === productData?.stock && !imageUrl && arraysAreSameItems(allTag,Array.isArray(productData.tag) ? productData.tag : JSON.parse(productData.tag)) ){
  toast.error("No changes detected");
  return ;
      }

    const data = new FormData();
    data.append("name",formData.name);
    data.append("description",formData.description);
    data.append("price",formData.price);
    data.append("stock",formData.stock);
    data.append("categoryId",formData.categoryId);
    data.append("discount",formData.discount);
    data.append("tag",JSON.stringify(allTag));
    data.append("productId",productData?._id);
    if(imageUrl){
       data.append("image",imageUrl);  
    }
    try {
      setLoading(true);
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/updateProduct`,data,{
        headers:{
          Authorization:'Bearer '+token,
        }
      })
      if(!response?.data?.success){
        throw new Error("Error occur during updating product");
      }
      toast.success(response?.data?.message);
      navigate("/dashboard/my-products");
      disapatch(removeProductData());
      setLoading(false);
      
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");     
    }

  }
console.log(productData);
  return (
    <div className={`text-richblack-5 ${location.pathname === "/edit-product" ? "p-4" : ""} h-full`}>
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100%-64px)]">
          <Spinner />
        </div>
      ) : (
        <>
          {verify ? (
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold">
                {" "}
                {productData && fromMyProducts? "Edit Product" : "Add Product"}
              </h2>
              <div className="bg-richblack-800 rounded-md p-4">
                <p className="text-xl font-semibold">Product Information</p>
                <form className="flex flex-col gap-4 mt-4" onSubmit={productData && fromMyProducts ? productEdithandler :  productCreatehandler}>
                  <label className="flex flex-col w-full">
                    <p>
                      Product Name<sup className="text-pink-400">*</sup>
                    </p>
                    <input
                      type="text"
                      required
                      onChange={onChangeHandler}
                      value={formData.name}
                      name="name"
                      className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md w-full"
                      placeholder="Enter your product name"
                    />
                  </label>

                  <label>
                    <p>
                      Product Description<sup className="text-pink-400">*</sup>
                    </p>
                    <textarea
                      name="description"
                      required
                      onChange={onChangeHandler}
                      value={formData.description}
                      rows={6}
                      cols={30}
                      className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md w-full"
                      placeholder="Write a short description about your product..."
                    ></textarea>
                  </label>
                  <label className="flex flex-col w-full">
                    <p>
                      Product Price<sup className="text-pink-400">*</sup>
                    </p>
                    <input
                      type="number"
                      onChange={onChangeHandler}
                      value={formData.price}
                      name="price"
                      required
                      className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md w-full"
                      placeholder="Enter your product price"
                    />
                  </label>
                  <label className="flex flex-col w-full">
                    <p>
                      Product Stock<sup className="text-pink-400">*</sup>
                    </p>
                    <input
                      type="number"
                      onChange={onChangeHandler}
                      value={formData.stock}
                      name="stock"
                      required
                      className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md w-full"
                      placeholder="Please enter the total available stock for this product"
                    />
                  </label>




     <label className="flex flex-col w-full">
                    <p>
                      Discount (%)<sup className="text-pink-400">*</sup>
                    </p>
                    <input
                      type="number"
                      onChange={onChangeHandler}
                      value={formData.discount}
                      name="discount"
                      required
                      className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md w-full"
                      placeholder="Enter discount percentage"
                    />
                  </label>









                  <label className="flex flex-col w-full">
                    <p className="mb-1 text-sm font-medium text-richblack-5">
                      Category <sup className="text-pink-400">*</sup>
                    </p>

                    <select
                    value={formData.categoryId}
                    name="categoryId"
                    onChange={onChangeHandler}
                      className="bg-richblack-700 rounded-md w-full p-2 border-b-[1px] border-richblack-5 outline-none"
                      disabled={categoryLoading}
                    >
                      <option value="">
                        {categoryLoading
                          ? "Loading categories..."
                          : "Choose a category that best fits your product"}
                      </option>

                      {!categoryLoading &&
                        category.map((ctry, index) => (
                          <option value={ctry._id} key={index}>
                            {ctry.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <MediaPicker setImageUrl={setImageUrl} updateImage={updateImage}/>
                  <Tag setAllTag={setAllTag} allTag={allTag}/>
                  {productData && fromMyProducts ? (
                    <button
                      type="submit"
                      className="bg-yellow-200 px-6 py-2 font-semibold text-richblack-900 hover:bg-yellow-300 rounded-md transition-all duration-300 cursor-pointer  flex justify-center items-center"
                    >
                      Update Product
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-yellow-200 px-6 py-2 font-semibold text-richblack-900 hover:bg-yellow-300 rounded-md transition-all duration-300 cursor-pointer  flex justify-center items-center"
                    >
                      Create Product
                    </button>
                  )}
                </form>
              </div>
            </div>
          ) : (
            <div className="text-pink-200 text-xl  flex justify-center items-center h-[calc(100%-64px)]">
              {" "}
           Your vendor profile is either not created or is pending verification by the admin
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddProduct;
