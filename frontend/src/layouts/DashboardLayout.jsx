import React from 'react'
import Navbar from './Navbar';

const DashboardLayout = ({children}) => {


  return (
    <div className=''>
        <Navbar />
        
            <div className='flex'>
                <div className='hidden lg:block'>
                </div>

                <div className='grow mx-5'>
                {children}
                </div>
            </div>

    </div>
  )
}

export default DashboardLayout