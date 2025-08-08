import React from 'react'
import { RxCross2 } from "react-icons/rx";
import YellowUnButton from "../common/YellowUnButton";
import UniversalButton from './UniversalButton';

const ConfirmationModal = ({setConfirmToggle,btn1,btn2,heading,desc,onclick}) => {
  return (
    <div className='bg-richblack-900 bg-opacity-90 z-50 fixed inset-0 flex justify-center items-center sm:p-0 px-2 text-richblack-5'>
     <div className='bg-richblack-800 px-4 py-8 w-[444px] rounded-md flex flex-col gap-4'>
        <div className='flex justify-between items-center '>
          <h2 className='font-semibold text-xl'>{heading}</h2>
        <RxCross2 size={25} onClick={()=>{setConfirmToggle(false)}} className='cursor-pointer'/>
        </div>
        <div>{desc}</div>
        <div className='flex flex-row gap-8 self-end mr-6 mt-2'>
           <div onClick={()=>{setConfirmToggle(false)}}>
            <UniversalButton>
            {btn1}
           </UniversalButton>
           </div>
           <YellowUnButton text={btn2} onclickHandler={onclick}/>
           
        </div>
     </div>

    </div>
  )
}

export default ConfirmationModal