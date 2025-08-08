import React from 'react'
import { useSelector } from 'react-redux'
import YellowUnButton from '../../common/YellowUnButton'
import { useNavigate } from 'react-router-dom'

const MyProfile = () => {
  const { userProfile } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  return (
    <div className='flex flex-col gap-6 w-full h-full text-richblack-5 overflow-x-hidden '>
      {/* Page Title */}
      <h2 className='text-3xl font-bold'>My Profile</h2>

      {/* Profile Card */}
      <div className='flex flex-col sm:flex-row sm:justify-between items-center bg-richblack-800 px-6 py-4 rounded-xl shadow-md gap-4 transition-all duration-300'>
        <div className='flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left'>
          <img
            src={userProfile?.profilePicture}
            alt='User'
            className='h-20 w-20 rounded-full border-2 border-yellow-400 object-cover'
          />
          <div>
            <p className='text-xl font-semibold'>
              {userProfile?.firstName} {userProfile?.lastName}
            </p>
            <p className='text-richblack-300 text-sm'>{userProfile?.email}</p>
          </div>
        </div>
        <YellowUnButton
          text='Edit'
          onclickHandler={() => navigate("/dashboard/settings")}
        />
      </div>

      {/* Personal Details Card */}
      <div className='bg-richblack-800 px-6 py-5 rounded-xl shadow-md flex flex-col gap-6'>
        <div className='flex justify-between items-center'>
          <h3 className='text-2xl font-semibold'>Personal Details</h3>
          <YellowUnButton
            text='Edit'
            onclickHandler={() => navigate("/dashboard/settings")}
          />
        </div>

        <div className='grid sm:grid-cols-2 gap-6'>
          <div>
            <p className='text-richblack-300 text-sm mb-1'>First Name</p>
            <p>{userProfile?.firstName}</p>
          </div>
          <div>
            <p className='text-richblack-300 text-sm mb-1'>Last Name</p>
            <p>{userProfile?.lastName}</p>
          </div>
          <div>
            <p className='text-richblack-300 text-sm mb-1'>Phone No.</p>
            <p>{userProfile?.phoneNumber || 'Not Provided'}</p>
          </div>
          <div>
            <p className='text-richblack-300 text-sm mb-1'>Gender</p>
            <p>{userProfile?.gender || 'Not Provided'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
