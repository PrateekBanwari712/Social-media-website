import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '../redux/user.slice';

const UserBox = ({ suggestedUser, selectedUser }) => {
    const dispatch = useDispatch();
    const { onlineUsers } = useSelector(state => state.chat);
    const isOnline = onlineUsers.includes(suggestedUser._id) || false;
    const isSelected = selectedUser?._id === suggestedUser._id;
    return (
        <div
            key={suggestedUser._id}
            className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition ${isSelected
                ? 'bg-blue-100 border-l-4 border-blue-600'
                : 'hover:bg-gray-100'
                }`}
            onClick={() => { dispatch(setSelectedUser(suggestedUser)) }}
        >
            <div className="relative">
                <Avatar className='w-12 h-12 rounded-full object-cover border-2 border-blue-300'>
                    <AvatarImage
                        src={suggestedUser?.profilePicture}
                        alt={suggestedUser?.userName}
                    />
                    <AvatarFallback>{suggestedUser.userName?.[0]}</AvatarFallback>
                </Avatar>
                {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>}
            </div>

            <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{suggestedUser.userName}</div>
                <div className={`text-xs ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                    {isOnline ? "Online" : "Offline"}
                </div>
            </div>
        </div>
    )
}

export default UserBox