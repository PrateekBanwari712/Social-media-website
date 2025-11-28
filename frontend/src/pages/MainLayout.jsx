import React from 'react'
import LeftSidebar from '../components/LeftSidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import RightSidebar from '../components/RightSidebar'
import BottomBar from '@/components/BottomBar'
import { useSelector } from 'react-redux'


const MainLayout = () => {
  const {user} = useSelector(state => state.user);
const navigate = useNavigate();
  if(!user){
    navigate("/login")
  }
  return (
    <div className='flex flex-col h-screen w-screen'>
      {/* Large devices: flex with left sidebar */}
      <div className='flex h-full'>
        {/* Left Sidebar - hidden on small/medium devices */}
        <div className='hidden lg:block'>
          <LeftSidebar />
        </div>

        {/* Main Feed (child route rendered here) */}
        <main className='flex-1 overflow-y-auto pb-16 lg:pb-0'>
          <Outlet />
        </main>
      </div>

      {/* Bottom Bar - only visible on small/medium devices */}
      <BottomBar />
    </div>
  )
}

export default MainLayout