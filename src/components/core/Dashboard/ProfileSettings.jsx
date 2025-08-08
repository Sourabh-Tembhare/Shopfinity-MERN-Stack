import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuUpload } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import Spinner from "../../common/Spinner";
import axios from "axios";
import { removeProfile, setProfile } from "../../../redux/slices/profile";
import toast from "react-hot-toast";
import { removeToken } from "../../../redux/slices/auth";

const ProfileSettings = () => {
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const [profileLoading, setProfileLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(true);
  const profile = useSelector(
    (state) => state.profile.userProfile?.profilePicture
  );
  const { userProfile } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  // profile picture change
  const [ImageUrlprofilePicture, setImageUrlprofilePicture] = useState("");
  function fileHandler(e) {
    setImage(e.target.files[0]);
    setImageUrlprofilePicture(URL.createObjectURL(e.target.files[0]));
  }
  const [loading, setLoading] = useState(false);
  const profilePictureChandler = async () => {
    if (!image) {
      toast.error("Please select the image");
      return;
    }
    const formData = new FormData();
    formData.append("image", image);
    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/change-profilePicture`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!response?.data?.success) {
        throw new Error("Error when updating profilePicture");
      }
      dispatch(setProfile(response.data.updatedUser));
      setLoading(false);
      toast.success(response.data.message);
      setImage(null);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Profile Information

  const [formData, setFormData] = useState({
    phoneNumber: "",
    gender: "",
    firstName: "",
    lastName: "",
  });
  useState(() => {
    if (userProfile) {
      formData.firstName = userProfile?.firstName;
      formData.lastName = userProfile?.lastName;
      formData.phoneNumber = String(userProfile?.phoneNumber);
      if (userProfile?.gender) {
        formData.gender = userProfile?.gender;
      }
    }
  }, []);
  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  const profileInformationSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(formData);

    if (!formData.gender) {
      toast.error("Please select the gender");
      return;
    }
    if (formData.phoneNumber.length !== 10) {
      toast.error("Please provide a valid 10-digit phone number");
      return;
    }
    if (
      formData.firstName === userProfile?.firstName &&
      formData.lastName === userProfile?.lastName &&
      formData.gender === userProfile?.gender &&
      formData.phoneNumber === userProfile?.phoneNumber.toString()
    ) {
      toast.error("There are no changes to save");
      return;
    }
    try {
      setProfileLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/updateUserInformation`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!response?.data?.success) {
        throw new Error("Error occur during updating Profile information");
      }
      dispatch(setProfile(response?.data?.updatedUser));
      setProfileLoading(false);
      toast.success(response?.data?.message);
      navigate("/dashboard");
    } catch (error) {
      setProfileLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // Password section
  const [passwordChange, setPasswordChange] = useState({
    oldPassword: "",
    password: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  const passwordChangeHandler = (event) => {
    const { name, value } = event.target;
    setPasswordChange((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const changePasswordHandler = async (e) => {
    e.preventDefault();
    if (passwordChange.password.length < 8) {
      toast.error("Use at least 8 characters for a secure password");
      return;
    }
const specialCharRegex = /[!@#$%^&*()[\]{},./|+=-]/;

    if (!specialCharRegex.test(passwordChange.password)) {
      toast.error(
        "Password must include at least one special character (e.g., @, $, !)"
      );
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/changePassword`,
        passwordChange,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!response?.data?.success) {
        throw new Error("Error occur during change password");
      }

      toast.success(response.data.message);
      setPasswordLoading(false);
      passwordChange.oldPassword = "";
      passwordChange.password = "";
    } catch (error) {
      console.log(error);
      setPasswordLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // delete account for customer only
  const deleteAccountHandler = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirm) {
      return;
    }

    if (userProfile.accountType !== "customer") {
      toast.error("Only customers are permitted to delete their accounts.");
      return;
    }
    try {
      setDeleteLoading(true);
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/deleteAccount`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!response?.data?.success) {
        throw new Error("Error occur during deleting account");
      }
      toast.success(response.data?.message);
      setDeleteLoading(false);
      dispatch(removeToken());
      dispatch(removeProfile())
      localStorage.clear();
      navigate("/signup");
    } catch (error) {
      console.log(error);
      setDeleteLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {deleteLoading ? (
        <div className="flex items-center justify-center w-full h-[calc(100%-64px)]">
          <Spinner />
        </div>
      ) : (
        <div className="text-richblack-5  w-full">
          {/* part 1  */}
          <div>
            <h2 className='text-3xl font-bold'>Edit Profile</h2>
          </div>

          {/* part 2  */}
          <div className="mt-10 flex flex-col gap-4">
            {/* profile picture update section  */}
            <div className="flex sm:flex-row flex-col bg-richblack-800 gap-4  items-center p-6 rounded-md">
              <div className="relative">
                <img
                  src={profile}
                  alt="userProfileImage"
                  className="aspect-square h-[78px] w-[78px] object-cover rounded-full "
                />
                {ImageUrlprofilePicture && (
                  <img
                    src={ImageUrlprofilePicture}
                    alt="selectedImage"
                    className="aspect-square h-[78px] w-[78px] object-cover rounded-full absolute top-0"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-richblack-25">Change Profile Picture</p>
                <div className="flex gap-2">
                  <label
                    className="  bg-richblack-700  px-4 py-1
                rounded-md cursor-pointer"
                  >
                    <p>Select</p>
                    <input
                      type="file"
                      className="hidden"
                      onChange={fileHandler}
                    />
                  </label>

                  <div
                    className="flex gap-2 cursor-pointer items-center bg-yellow-50 text-richblack-900 px-4 py-1 hover:bg-yellow-100
                transition-all duration-300 rounded-md"
                    onClick={profilePictureChandler}
                  >
                    <p>Upload</p>
                    <LuUpload />
                    {loading && (
                      <div className="w-4 h-4 ml-2 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* personal information section  */}
            <div className="p-6 bg-richblack-800 flex flex-col rounded-md gap-6 relative">
              <p className="text-2xl font-semibold">Profile Information</p>
              <form
                onSubmit={profileInformationSubmitHandler}
                className="flex flex-col gap-4"
              >
                {/* First & Last Name */}
                <div className="flex flex-col md:flex-row gap-4">
                  <label className="flex flex-col w-full md:w-1/2">
                    <p>First Name<sup className='text-pink-400'>*</sup></p>
                    <input
                      onChange={changeHandler}
                      type="text"
                      value={formData.firstName}
                      name="firstName"
                      placeholder="Enter Your First Name"
                      className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md"
                    />
                  </label>
                  <label className="flex flex-col w-full md:w-1/2">
                    <p>Last Name<sup className='text-pink-400'>*</sup></p>
                    <input
                      onChange={changeHandler}
                      type="text"
                      placeholder="Enter Your Last Name"
                      value={formData.lastName}
                      name="lastName"
                      className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md"
                    />
                  </label>
                </div>

                {/* Gender & Contact */}
                <div className="flex flex-col md:flex-row gap-4">
                  <label className="flex flex-col gap-2 w-full md:w-1/2">
                    <p>Gender<sup className='text-pink-400'>*</sup></p>
                    <select
                      onChange={changeHandler}
                      value={formData.gender}
                      name="gender"
                      className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-3 rounded-md"
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 w-full md:w-1/2">
                    <p>Contact Number<sup className='text-pink-400'>*</sup></p>
                    <input
                      type="text"
                      onChange={changeHandler}
                      value={formData.phoneNumber}
                      name="phoneNumber"
                      placeholder="Enter Contact Number"
                      className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md"
                    />
                  </label>
                </div>

                <div className="md:h-20 md:hidden"></div>

                <div className="flex gap-4 md:absolute md:-bottom-14 md:right-6 mt-4 justify-end ">
                  <Link
                    to="/dashboard"
                    className="bg-richblack-700 px-4 py-1 rounded-md cursor-pointer hover:bg-richblack-800 transition-all duration-300"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="flex gap-2 items-center bg-yellow-50 text-richblack-900 px-4 py-1 hover:bg-yellow-100 transition-all duration-300 rounded-md"
                  >
                    Save
                    {profileLoading && (
                      <div className="w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* password change section  */}
            <div className="p-6 bg-richblack-800 flex flex-col rounded-md gap-6 mt-16">
              <p className="text-2xl font-semibold">Password</p>
              <form
                className="flex gap-4 relative lg:flex-row flex-col"
                onSubmit={changePasswordHandler}
              >
                <label className="flex flex-col gap-2 lg:w-[50%] relative">
                  <p>Current Password<sup className='text-pink-400'>*</sup></p>
                  <input
                    required
                    type={`${open1 ? "text" : "password"}`}
                    value={passwordChange.oldPassword}
                    name="oldPassword"
                    onChange={passwordChangeHandler}
                    placeholder="Enter your current password"
                    className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md "
                  />
                  <div
                    onClick={() => {
                      setOpen1((prev) => !prev);
                    }}
                    className="absolute top-10 right-4"
                  >
                    {open1 ? (
                      <FaRegEye size={23} />
                    ) : (
                      <FaRegEyeSlash size={23} />
                    )}
                  </div>
                </label>
                <label className="flex flex-col gap-2 lg:w-[50%] relative">
                  <p>New Password<sup className='text-pink-400'>*</sup></p>
                  <input
                    required
                    type={`${open2 ? "text" : "password"}`}
                    value={passwordChange.password}
                    name="password"
                    onChange={passwordChangeHandler}
                    placeholder="Enter new  password"
                    className="bg-richblack-700 outline-none border-b-[1px] border-richblack-5 p-2 rounded-md "
                  />
                  <div
                    onClick={() => {
                      setOpen2((prev) => !prev);
                    }}
                    className="absolute top-10 right-4"
                  >
                    {open2 ? (
                      <FaRegEye size={23} />
                    ) : (
                      <FaRegEyeSlash size={23} />
                    )}
                  </div>
                </label>
                <div className="flex gap-4 absolute -bottom-20 right-0">
                  <Link
                    to={"/dashboard"}
                    className="  bg-richblack-700  px-4 py-1
                rounded-md cursor-pointer hover:bg-richblack-800 transition-all duration-300"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className=" flex gap-1 items-center  bg-yellow-50 text-richblack-900 px-4 py-1 hover:bg-yellow-100
                transition-all duration-300 rounded-md"
                  >
                    Save
                    {passwordLoading && (
                      <div className="w-4 h-4 ml-2 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* delete account section  */}
            <div className="flex gap-4 bg-pink-700 relative mt-16 rounded-md p-6 mb-14">
              <div className="bg-pink-800 rounded-full h-[40px] w-[40px] p-2">
                <RiDeleteBinLine size={25} className="text-pink-200" />
              </div>
              <div className="flex flex-col gap-4 ">
                <p className="font-semibold text-xl">Delete Account</p>
                <div>
                  <p className="text-richblack-100">
                    Would you like to delete account?
                  </p>
                  <p className=" text-richblack-100 w-[80%]">
                    This account contains Paid Courses. Deleting your account is
                    permanent and will remove all the contain associated with
                    it.
                  </p>
                </div>
                <div
                  className="italic cursor-pointer text-pink-300 "
                  onClick={deleteAccountHandler}
                >
                  I want to delete my account
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSettings;
