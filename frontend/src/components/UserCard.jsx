import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { useSelector } from 'react-redux'
import useFollowHanlder from '../utilities/useFollowHanlder'

const UserCard = ({ uf }) => {
    const { user } = useSelector(state => state.user);
    const isFollowing = user.following.includes(uf?._id);
    const isFollowed = user.followers.includes(uf?._id);
    const { followOrUnfollowHandler } = useFollowHanlder();
    return (
        <div className='my-2 w-full p-1 bg-gray-100 rounded-2xl flex justify-between'>
            <div className='flex gap-3 items-center'>
                <Avatar className={' border-2 border-blue-500 w-10 h-10 ml-1'} >
                    <AvatarImage className={''} src={uf?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-col px-2 py-0.5 rounded-lg '>
                    <h1 className='text-lg '>{uf?.userName}</h1>

                </div>
            </div>
            <div>
                <Button
                    className={`bg-blue-500 text-white px-2 py-1 rounded-lg text-sm hover:bg-blue-600 transition ${isFollowing && "bg-red-500 hover:bg-red-600"} cursor-pointer`}
                onClick={() => followOrUnfollowHandler(uf)}
                >
                    {
                        isFollowed && !isFollowing ? "Follow back"
                            : isFollowing ? "Unfollow"
                                : isFollowed && isFollowing ? "Unfollow"
                                    : "Follow"
                    }
                </Button>
            </div>

        </div>
    )
}

export default UserCard