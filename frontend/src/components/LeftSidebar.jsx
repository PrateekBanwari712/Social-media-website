import React, { useState } from "react";
import CreatePost from "./CreatePost";
import { useLocation, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png'
import {
  FiHome as Home,
  FiSearch as Search,
  FiTrendingUp as TrendingUp,
  FiMessageCircle as MessageCircle,
  FiHeart as Heart,
  FiPlusSquare as PlusSquare,
  FiLogOut as LogOut,
} from "react-icons/fi";
import { MdVideoLibrary as Reels } from "react-icons/md";


import axios from "axios";
import { API_URL } from "../utilities/constant";
import { useDispatch, useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import toast from "react-hot-toast";
import { setSelectedUser, setSuggestedUsers, setUser } from "@/redux/user.slice";
import { setPosts, setSelectedPost } from "@/redux/post.slice";
import { setMessages } from "@/redux/chat.slice";
import { removeNotification, setLikeNotification } from "@/redux/rtn.slice";
import SearchBar from "./SearchBar";



const LeftSidebar = () => {
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { likeNotification } = useSelector(store => store.realtimeNotification);
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  if (!user || user == null) {
    navigate("/login")
  }

  const SidebarItems = [
    { icon: <Home size={30} />, text: "Home", path: "/" },
    { icon: <Search size={30} />, text: "Search", path: "/search" },
    { icon: <Reels size={30} />, text: "Reels", path: "/reels" },
    { icon: <MessageCircle size={30} />, text: "Messages", path: "/messages" },
    { icon: <Heart size={30} />, text: "Notification" },
    { icon: <PlusSquare size={30} />, text: "Create" },
    {
      icon: (
        <Avatar className="w-8 h-8 border-2 border-blue-500">
          {user?.profilePicture ? <AvatarImage src={user?.profilePicture} alt="@profile" /> : <AvatarFallback>CN</AvatarFallback>}
        </Avatar>
      ),
      text: "Profile", path: `/profile/${user?._id}`
    },
    { icon: <LogOut size={30} />, text: "Logout" },
  ];

  //logout handler
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/logout`, { withCredentials: true })
      if (res.data.success) {
        navigate("/login")
        dispatch(setUser(null))
        dispatch(setSelectedPost(null))
        dispatch(setSelectedUser(null))
        dispatch(setPosts([]))
        dispatch(setSuggestedUsers([]))
        dispatch(setMessages([]))
        toast.success(res.data.message)

      }
    } catch (error) {
      console.log(error)
    }
  }

  // Handle sidebar item click
  const handleItemClick = (item) => {
    if (item.text == 'Logout') { logoutHandler(); }
    else if (item.text === "Create") {
      setOpen(true);
    } else if (item.text == "Home") {
      navigate("/")
    } else if (item.text == 'Messages') {
      navigate("/messages")
    } else if (item.text == 'Profile') {
      navigate(`/profile/${user?._id}`)
    } else if (item.text == 'Reels') {
      navigate("/reels")
    } else if (item.text == 'Search') {
      setSearchOpen(true)
    }

  };

  return (
    <>
      <aside className="bg-white border-r border-gray-200 min-h-screen p-4  flex-col items-center md:items-start sm:hiddenh lg:flex  lg:w-[20vw] md:w-60  transition-all duration-200">
        <SearchBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
        <nav className="flex flex-col gap-2 w-full">
          <div className="flex items-center  ">
            <img src={logo} className="h-[7vh] -mr-4" alt="" />
            <h1 className='my-4 pl-5 font-bold text-xl hidden md:inline'>Chattri</h1>
          </div>
          {SidebarItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : item.path && location.pathname.startsWith(item.path);
            return (
              <div
                key={item.text}
                onClick={() => handleItemClick(item)}
                className={`
    flex items-center gap-4 px-3 py-2 rounded-lg 
    cursor-pointer relative transition font-medium w-full 
    ${isActive ? "bg-gradient-to-bl from-blue-300 to-purple-500  text-white shadow-md"
                    : "text-gray-700 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-200"
                  }
  `}
              >
                <span>{item.icon}</span>

                <span className="hidden md:inline text-xl">{item.text}</span>
                {
                  item.text == 'Notification' && likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className={'rounded-full h-[2px] w-[2px] absolute bottom-6 left-6 bg-red-600'}>
                          {likeNotification.length}
                        </Button>
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
                                    className='my-2 flex gap-3 items-center cursor-pointer'>
                                    <Avatar>
                                      <AvatarImage src={notification.userDetails?.profilePicture} />
                                      <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <p className='text-sm'><span className='font-bold'>{notification.userDetails?.userName}</span> liked your post</p>
                                  </div>
                                )
                              })
                            )
                          }
                        </div>
                      </PopoverContent>
                    </Popover>
                  )
                }
              </div>
            )
          })}
        </nav>

      </aside>
      {open && <CreatePost open={open} setOpen={setOpen} />}
    </>
  );
};

export default LeftSidebar;