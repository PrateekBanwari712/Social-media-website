import React, { useState, useEffect } from "react";
import {  useSelector } from "react-redux";
import useGetAllMessages from '../hooks/useGetAllMessages'
import Messages from "./Messages";
import { FaAngleDoubleLeft } from "react-icons/fa";
import { IoMdClose, IoMdSearch } from "react-icons/io";
import { Button } from "./ui/button";
import UserBox from "./userBox";

const ChatPage = () => {
	useGetAllMessages();
	const { user, selectedUser, suggestedUsers } = useSelector(state => state.user);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		if (!selectedUser) {
			setIsSidebarOpen(true);
		}
	}, [selectedUser]);

	const otherUsers = suggestedUsers
		?.filter(u => {
			const iFollow = user.following.includes(u._id);
			const theyFollow = user.followers.includes(u._id);

			const isFriend = iFollow && theyFollow; // mutual followers

			return !isFriend; // show only non-friends
		})
		?.filter(u =>
			searchQuery.trim()
				? u?.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				u?.bio?.toLowerCase().includes(searchQuery.toLowerCase())
				: true
		) || [];


	return (
		<div className="h-full w-full flex flex-col bg-white">
			<div className="flex h-full w-full">
				{/* Left Sidebar: Suggested Users */}
				<div
					className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
						} md:relative md:translate-x-0 md:block`}
				>
					<aside className="w-full h-full flex flex-col p-4 ">
						<div className="flex items-center gap-3 mb-4  md:ml-2">
							<button
								onClick={() => setIsSidebarOpen(false)}
								className="p-2 hover:bg-gray-100 rounded-full transition block md:hidden"
							>
								<FaAngleDoubleLeft size={18} className="text-blue-600" />
							</button>
							<h2 className="text-xl font-semibold text-gray-900">Messages</h2>
						</div>
						<div className="mb-2">
							<div>
								<h1 className="font-semibold text-xl ww-full border-2 rounded-lg px-2 py-1 mb-2">Friends</h1>
							</div>
							<div className="flex-1 overflow-y-auto space-y-2">
								{suggestedUsers.filter((friends) => user.followers.includes(friends._id) && user.following.includes(friends._id)).map((suggestedUser) => {
									return (
										<UserBox suggestedUser={suggestedUser} selectedUser={selectedUser} />
									)
								}
								)}

							</div>
						</div>
						<div className="">
							<div>
								<h1 className="font-semibold text-xl w-full border-2 rounded-lg px-2 py-1 mb-2">Suggested Users</h1>
							</div>
							<div className="px-1 border-b border-gray-200">
								<div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1 mb-2">
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



							<div className="flex-1 overflow-y-auto space-y-2">
								{otherUsers?.map((suggestedUser) => {
									return (
										<UserBox suggestedUser={suggestedUser} selectedUser={selectedUser} />
									)
								}
								)}

							</div>
						</div>
					</aside>
				</div>
				{/* Chat Area */}
				<div className="flex-1 flex flex-col h-full bg-white">
					{selectedUser ? (
						<Messages selectedUser={selectedUser} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
					) : (
						<>

							<div className="flex flex-col gap-2 items-center justify-center h-full text-gray-400">
								<p>Select a user to start messaging</p>
								<Button
									onClick={() => setIsSidebarOpen(true)}
									className="bg-purple-400 md:hidden"
								>Select a user</Button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
