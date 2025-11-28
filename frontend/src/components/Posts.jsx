import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const { posts } = useSelector(store => store.post)
  return (
    <div className=' '>
      {
        posts && posts.length > 0 ? (posts.map((post) => (
          <Post key={post._id} post={post} />

        )
        )) : (
          <div className='h-full w-full flex items-center justify-center'>
            <h1 className='text-2xl '>No Posts Yet! </h1>
          </div>
        )}
    </div>
  )
}

export default Posts