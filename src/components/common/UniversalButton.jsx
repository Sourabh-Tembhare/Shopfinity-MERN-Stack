import React from 'react'
import { Link } from 'react-router-dom'

const UniversalButton = ({to,children}) => {
  return (
    <>
    <Link to={to} className='px-6 py-2 bg-richblack-900 border-[1px] border-richblack-700 text-richblack-5 hover:bg-richblack-800 transition-all duration-300 flex items-center'>
  {
    children
  }
    </Link>
    </>
  )
}

export default UniversalButton