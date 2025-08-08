import React from 'react'
import SignUpFrom from '../auth/SignUpFrom'
import LoginFrom from '../auth/LoginFrom'


const Template = ({img,des1,des2,des3,fromType}) => {
  return (
    <div className={`flex ${fromType === "signup" ? "lg:mt-3" : "lg:mt-20"} mt-10 text-richblack-5 lg:flex-row lg:gap-52 w-11/12 mx-auto justify-center flex-col gap-10`}>
      
      {/* section 1  */}
      <div className='lg:w-[30%] flex flex-col  gap-4'>
        <p className='text-3xl font-semibold'>{des1}</p>
        <div>
            <p className='text-richblack-100'>{des2}</p>
            <p className='text-blue-200 italic'>{des3}</p>
        </div>
        <div>
            {
                fromType === "signup" ? <SignUpFrom/> : <LoginFrom/>
            }
        </div>
      </div>

      {/* section 2  */}
      <div className="relative flex justify-center " >
        <img src={img} alt="formImg" loading='lazy' className={`w-[400px] h-[370px] z-40 relative rounded-sm shadow-[15px_15px_15px_aqua] mb-7 ${fromType === "signup" ? "lg:mt-20" : ""}`} />

      </div>

    </div>
  )
}

export default Template