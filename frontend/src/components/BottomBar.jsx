import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreatePost from "./CreatePost";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    FiHome as Home,
    FiMessageCircle as MessageCircle,
    FiPlusSquare as PlusSquare,
} from "react-icons/fi";
import { MdVideoLibrary as Reels } from "react-icons/md";

const BottomBar = () => {
    const { user } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        {
            icon: Home,
            label: "Home",
            path: "/",
            onClick: () => navigate("/"),
        },
        {
            icon: Reels,
            label: "Reels",
            path: "/reels",
            onClick: () => navigate("/reels"),
        },
        {
            icon: PlusSquare,
            label: "Create",
            onClick: () => setOpen(true),
        },
        {
            icon: MessageCircle,
            label: "Messages",
            path: "/messages",
            onClick: () => navigate("/messages"),
        },
        {
            icon: (
                <Avatar className="w-8 h-8 border border-blue-500">
                    {user?.profilePicture ? <AvatarImage src={user?.profilePicture} alt="@profile" /> : <AvatarFallback>CN</AvatarFallback>}
                </Avatar>
            ),
            label: "Profile",
            path: `/profile/${user?._id}`,
            isAvatar: true,
            onClick: () => navigate(`/profile/${user?._id}`),
        },
    ];

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-300 lg:hidden z-50">
                <nav className="flex justify-around items-center h-full">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.path === "/" ? location.pathname === "/" : item.path && location.pathname.startsWith(item.path);
                        return (
                            <button
                                key={item.label}
                                onClick={item.onClick}
                                className={`flex flex-col items-center justify-center w-full h-full hover:bg-gray-100 transition  
                                    ${isActive
                                        ? "bg-gradient-to-bl from-blue-300 to-purple-500  text-white shadow-md"
                                        : "text-gray-700 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-200"
                                    }`}
                                title={item.label}
                            >
                                {/* Render avatar OR icon */}
                                {item.isAvatar ? (
                                    item.icon
                                ) : (
                                    <Icon size={24} className="mb-1" />
                                )}

                                <span className={`text-xs text-gray-600 ${isActive && "text-white"}`}>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* CreatePost dialog */}
            {open && <CreatePost open={open} setOpen={setOpen} />}
        </>
    );
};

export default BottomBar;