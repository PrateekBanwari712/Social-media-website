import React from 'react'
import Feed from '../components/Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from '../components/RightSidebar'
import useGetAllPosts from '../hooks/useGetAllPosts.jsx'
import useGetSugesstedUsers from '../hooks/useGetSugesstedUsers.jsx'


const Home = () => {
  useGetAllPosts();
  useGetSugesstedUsers();
  return (
    <div className='flex  '>
      <div className='flex-grow'>
        <Outlet />
        <Feed className='' />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home