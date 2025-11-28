import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { RxCross2 } from "react-icons/rx";
import useLogoutHandler from "@/utilities/useLogoutHandler";
import PostCard from "@/components/postCard";
import { FaPaintBrush } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import useFollowHanlder from "@/utilities/useFollowHanlder";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UserCard from "@/components/userCard";


const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const { loading } = useGetUserProfile(userId);
  const { user, userProfile } = useSelector(state => state.user);
  const navigate = useNavigate();
  const { logoutHandler } = useLogoutHandler();
  const isFollowing = !!user?.following?.includes(userId);
  const isFollowed = !!user?.followers?.includes(userId);
  const { followOrUnfollowHandler } = useFollowHanlder();

  return (
    <>
      {
        loading ? (<div> Loading
        </div >
        ) : (
          <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 to-purple-200 py-4 sm:py-6 px-3 sm:px-4 md:px-6 flex flex-col items-center">
            {/* Profile Header */}
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 relative">
              {userId !== user?._id && <div
                onClick={() => navigate("/")}
                className="absolute md:hidden top-3 right-3 ">
                <RxCross2 size={20} />
              </div>}
              <div className="flex sm:flex-row items-center sm:items-start gap-2">
                {/* Profile Picture */}
                <img
                  src={userProfile?.profilePicture}
                  alt={userProfile?.userName}
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-300 shadow-md flex-shrink-0"
                />

                {/* Profile Info */}
                <div className="flex-1 w-full items-start sm:text-left ">

                  {/* Username and Edit Button */}
                  <div className="flex flex-co sm:flex-row justify-start  md:items-center gap-3 mb-4">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">{userProfile?.userName}</h1>
                    {userProfile?._id === user?._id ? (

                      <div className="flex items-center justify-center gap-2">
                        <div>
                          <button
                            onClick={() => navigate("/profile/edit")}
                            className="bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer text-sm sm:text-base flex items-center justify-center gap-2">
                            <FaPaintBrush size={20} />
                            <span className="hidden md:block">Edit</span>
                          </button>
                        </div>
                        <div onClick={logoutHandler} className="">
                          <button className="bg-red-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-red-700 transition cursor-pointer text-sm sm:text-base flex items-center justify-center gap-2 " >
                            <FiLogOut size={20} />
                            <span className="hidden md:block">Logout</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <button className={`bg-blue-500 text-white px-2 py-1 rounded-lg text-md hover:bg-blue-600 transition ${isFollowing && "bg-red-500 hover:bg-red-600"} cursor-pointer`}
                          onClick={() => { followOrUnfollowHandler(userProfile) }}
                        >
                          {
                            isFollowed && !isFollowing ? "Follow back"
                              : isFollowing ? "Unfollow"
                                : isFollowed && isFollowing ? "Unfollow"
                                  : "Follow"
                          }
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex justify-start items-center sm:justify-start gap-4 sm:gap-6 md:gap-8 mb-4 text-gray-700 text-sm sm:text-base">
                    <div className="text-center sm:text-left">
                      <span className="font-bold block sm:inline">{userProfile?.posts.length}</span>
                      <span className="ml-1">posts</span>
                    </div>
                    <Dialog >
                      <DialogTrigger>
                        <div
                          className="text-center sm:text-left">
                          <span className="font-bold block sm:inline">{userProfile?.followers.length}</span>
                          <span className="ml-1">followers</span>
                        </div>
                      </DialogTrigger>
                      <DialogContent className={' max-h-[70vh]'}>
                        <div>
                          <div className="border-1 rounded-lg px-2 py-1 m-1  bg-gradient-to-br from-blue-100 to-purple-200 ">
                            <h1 className="text-xl">{`${userProfile?.userName}'s followers`}</h1>
                          </div>
                          <div className="overflow-y-scroll">
                            {userProfile?.followers.length > 0 ? (
                              userProfile?.followers?.map((uf) => {
                                return (
                                  <UserCard uf={uf} />
                                )
                              })
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <h2>{`There's no user followed by ${userProfile?.userName}`} </h2>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger>
                        <div className="text-center sm:text-left">
                          <span className="font-bold block sm:inline">{userProfile?.following.length}</span>
                          <span className="ml-1">following</span>
                        </div>
                      </DialogTrigger>
                      <DialogContent className={'max-h-[70vh]'}>
                        <div>
                          <div className="border-1 rounded-lg px-2 py-1 m-1  bg-gradient-to-br from-blue-100 to-purple-200 ">
                            <h1 className="text-xl">{`${userProfile?.userName}'s following`}</h1>
                          </div>
                          <div className="overflow-y-scroll">
                            {userProfile.following.length > 0 ? (userProfile?.following?.map((uf) => {
                              return (
                                <UserCard uf={uf} />
                              )
                            })) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <h2>{`There's no user following ${userProfile?.userName}`} </h2>
                              </div>
                            )
                            }
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>


                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm sm:text-base mb-4">{userProfile?.bio}</p>

                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className="w-full max-w-7xl bg-white rounded-xl shadow p-4 sm:p-6 md:p-8 mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-blue-700">Posts</h2>

              {userProfile.posts && userProfile.posts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  {/* User's Posts */}
                  {userProfile.posts.map((post) => {
                    return (
                      <PostCard post={post} />
                    )
                  })
                  }
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-base sm:text-lg">No posts yet</p>
                </div>
              )}

            </div>


            {/* Bookmark Section */}
            {userProfile?._id === user?._id && userProfile?.bookmarks.length > 0 &&
              <div className="w-full max-w-7xl bg-white rounded-xl shadow p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-blue-700">Bookmarks</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  {/* User's Posts */}
                  {userProfile?.bookmarks.map((post) => {
                    return (
                      <PostCard post={post} />
                    )
                  })}
                </div>
              </div>}
          </div>
        )}


    </>);
};

export default Profile;
