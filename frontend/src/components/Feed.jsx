import React from 'react'
import Posts from './Posts'

import Navbar from './Navbar'

const Feed = () => {
  return (
    <div className="h-screen w-full 
      bg-gradient-to-br from-blue-100 to-purple-200 
      lg:py-8 py-20 sm:flex-col sm:gap-2 pb-20 lg:pb-0 lg:w-[62vw]
      overflow-y-scroll sm:overflow-y-auto
      flex flex-col 
      items-center 
      space-y-4"
    >
    <Navbar className="lg:hidden"/>
      <Posts className="" />
    </div>
  )
}

export default Feed