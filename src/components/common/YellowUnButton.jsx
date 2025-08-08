import React from 'react'

const YellowUnButton = ({text,onclickHandler}) => {
  return (
    <div onClick={onclickHandler} className='bg-yellow-200 px-6 py-2 font-semibold text-richblack-900 hover:bg-yellow-300 rounded-md transition-all duration-300 cursor-pointer  flex justify-center items-center'>
{
    text
}
    </div>
  )
}

export default YellowUnButton