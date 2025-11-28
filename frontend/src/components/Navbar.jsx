import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart } from 'react-icons/fi'
import { IoMdClose, IoMdSearch } from 'react-icons/io'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { removeNotification } from '../redux/rtn.slice.js'

const Navbar = () => {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const { suggestedUsers } = useSelector(state => state.user);
    const { likeNotification } = useSelector(store => store.realtimeNotification);

    // Filter suggested users
    const filteredUsers = searchQuery.trim()
        ? suggestedUsers?.filter(user =>
            user?.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user?.bio?.toLowerCase().includes(searchQuery.toLowerCase())
        ) || []
        : [];

    const handleClose = () => {
        setSearchQuery('');
        setSearchOpen(false);
    };

    return (
        <>
            {/* TOP NAVBAR (Fixed 10vh) */}
            <div className='fixed top-0 left-0 w-full h-14 md:h-16 bg-white z-50 shadow flex items-center px-4 justify-between lg:hidden'>
                <h1 className='font-semibold text-2xl'>Chattri</h1>

                <div className="flex-1 mx-3">
                    <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 md:py-2 h-9 md:h-10">
                        <IoMdSearch size={18} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchOpen(true)}
                            className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
                        />
                        {searchOpen && (
                            <button
                                onClick={handleClose}
                                className="p-1 hover:bg-gray-200 rounded-full transition"
                            >
                                <IoMdClose size={16} className="text-gray-500" />
                            </button>
                        )}
                    </div>
                </div>
                <div className='relative'>

                    <Popover>
                        <PopoverTrigger asChild>
                            <div>
                                <FiHeart size={25} />
                                {likeNotification?.length > 0 && <button className={'rounded-full h-5 w-5 flex items-center justify-center absolute bottom-3 left-2 bg-red-500'}>
                                    {likeNotification.length}
                                </button>}
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div >
                                {
                                    likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                        likeNotification.map((notification) => {
                                            return (
                                                <div key={notification?.userId}
                                                    onClick={() => dispatch(removeNotification({
                                                        userId: notification.userId,
                                                        postId: notification.postId
                                                    }))}
                                                    className='my-2 flex items-center justify-between cursor-pointer'>
                                                    <div className='flex items-center gap-3'>
                                                        <Avatar>
                                                            <AvatarImage src={notification.userDetails?.profilePicture} />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <p className='text-sm'><span className='font-bold'>{notification.userDetails?.userName}</span> liked your post</p>
                                                    </div>

                                                    <div
                                                        onClick={() => dispatch(removeNotification({
                                                            userId: notification.userId,
                                                            postId: notification.postId
                                                        }))}>
                                                        <IoMdClose />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )
                                }
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Backdrop below navbar but above page content (closes panel when clicked) */}
            {searchOpen && (
                <div
                    className="fixed left-0 right-0 bottom-0 top-14 md:top-16 bg-black/40 z-30"
                    onClick={handleClose}
                />
            )}

            {/* SEARCH PANEL anchored under the navbar (slides up to meet the navbar without gap) */}
            <div
                className={`fixed left-0 right-0 top-14 md:top-16 bottom-0 bg-white z-40 overflow-y-auto shadow-2xl transition-transform duration-300 ease-in-out ${searchOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <div className="p-4 sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Search</h3>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100">
                        <IoMdClose />
                    </button>
                </div>

                <div className="p-4">
                    {filteredUsers.length > 0 ? (
                        <div className="space-y-3">
                            {filteredUsers.map((user) => (
                                <Link
                                    key={user._id}
                                    to={`/profile/${user._id}`}
                                    onClick={handleClose}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                                >
                                    <Avatar className="h-10 w-10 border border-gray-200">
                                        {user?.profilePicture ? (
                                            <AvatarImage src={user.profilePicture} />
                                        ) : (
                                            <AvatarFallback className="bg-blue-200">
                                                {user?.userName?.charAt(0)}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 truncate">{user?.userName}</p>
                                        <p className="text-sm text-gray-500 truncate">{user?.bio || 'No bio'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : searchQuery ? (
                        <div className="text-center py-12">
                            <IoMdSearch size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 text-base">No users found for "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <IoMdSearch size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 text-base">Start typing to search users</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
