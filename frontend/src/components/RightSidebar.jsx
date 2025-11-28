import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import useFollowHanlder from "../utilities/useFollowHanlder.js";
import { Button } from "./ui/button.jsx";
import { useNavigate } from "react-router-dom";

const RightSidebar = () => {
  const { suggestedUsers, user } = useSelector(store => store.user)
  const { followOrUnfollowHandler } = useFollowHanlder();
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col lg:w-[20vw] bg-white border-l border-gray-200 p-4 min-h-screen absolute right-0">
      <h2 className="text-lg font-semibold mb-4 text-blue-700">Suggested Users</h2>
      <ul className="space-y-2">

        {/*suggested Users*/}
        {suggestedUsers.map((targetUser) => {
          const isFollowing = !!user?.following?.includes(targetUser._id);
          const isFollowed = !!user?.followers?.includes(targetUser._id);
          return (
            <li

              key={targetUser?._id} className="flex items-center justify-between border-2 p-2 shadow-xs rounded-2xl cursor-pointer ">
              <div
                onClick={() => { navigate(`/profile/${targetUser._id}`) }}
                className="flex items-center space-x-3">
                <img
                  src={targetUser?.profilePicture}
                  alt={targetUser?.userName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                />
                <span className="font-medium text-gray-800">{targetUser?.userName}</span>
              </div>
              <Button className={`bg-blue-500 text-white max-w-[40%] w-[80px] px-2 py-1 rounded-lg text-sm hover:bg-blue-600 transition ${isFollowing && "bg-red-500 hover:bg-red-600"} cursor-pointer`}
                onClick={() => followOrUnfollowHandler(targetUser)}
              >
                {
                  isFollowed && !isFollowing ? "Follow back"
                    : isFollowing ? "Unfollow"
                      : isFollowed && isFollowing ? "Unfollow"
                        : "Follow"
                }
              </Button>
            </li>
          )
        }
        )}
      </ul>
    </aside>
  );
};

export default RightSidebar;