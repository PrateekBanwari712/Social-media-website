import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoMdClose, IoMdSearch } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const SearchBar = ({ searchOpen, setSearchOpen }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const { suggestedUsers } = useSelector(state => state.user);
  const overlayRef = React.useRef();

  // Filter suggested users based on search query
  const filteredUsers = searchQuery.trim()
    ? suggestedUsers?.filter(user =>
      user?.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||  []
    : suggestedUsers || [];

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchOpen && overlayRef.current && e.target === overlayRef.current) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [searchOpen]);

  const handleClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleUserClick = () => {
    handleClose();
  };

  return (
    <>
      {/* Backdrop Overlay */}
      {searchOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => handleClose()}
        />
      )}

      {/* Slide-out Search Panel */}
      <div
        className={`fixed top-0 left-0 h-screen w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${searchOpen ? 'translate-x-0' : '-translate-x-full'
          } overflow-y-auto`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Search Users</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            title="Close"
          >
            <IoMdClose size={24} className="text-gray-700" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <IoMdSearch size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-gray-200 rounded-full transition"
              >
                <IoMdClose size={18} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="p-4">
          {filteredUsers && filteredUsers.length > 0 ? (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user._id}`}
                  onClick={handleUserClick}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                >
                  {/* Avatar */}
                  <Avatar className="h-10 w-10 border  border-blue-500">
                    {user?.profilePicture ? (
                      <AvatarImage src={user.profilePicture} />
                    ) : (
                      <AvatarFallback className="bg-blue-200">{user?.userName?.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg text-gray-800 truncate">{user?.userName}</p>
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

export default SearchBar;