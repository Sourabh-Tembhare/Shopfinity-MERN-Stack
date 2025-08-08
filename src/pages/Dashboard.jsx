import React from 'react'
import SideNav from '../components/core/Dashboard/SideNav'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
 <div className="flex ">
  {/* Sidebar */}
  <div className=" w-[20%] h-[calc(100vh-66px)] hidden md:flex ">
    <SideNav />
  </div>

  {/* Main content area */}
  <div className="lg:w-[80%] h-[calc(100vh-66px)] p-4 text-richblack-5 w-full overflow-y-auto">
    
      <Outlet />

  </div>
</div>

  )
}

export default Dashboard