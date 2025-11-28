import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Comment = ({ comment }) => {
    return (
        <div className='my-2 border p-1 bg-gray-50 rounded-2xl shadow-2xl'>
            <div className='flex gap-3 items-center'>
                <Avatar className={' border-2 border-blue-500 w-10 h-10'} >
                    <AvatarImage className={''} src={comment.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-col px-2 py-0.5 rounded-lg '>
                    <h1 className='font-semibold text-sm '>{comment?.author?.userName}</h1>
                    <span className='font-normal pl-1'>{comment?.text}</span>
                </div>
            </div>
        </div>
    )
}

export default Comment