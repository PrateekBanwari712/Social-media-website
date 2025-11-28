import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetAllMessages from '@/hooks/useGetAllMessages';
import useGetRTM from '@/hooks/useGetRTM';
import { Button } from './ui/button';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from '@/utilities/constant';
import { setMessages } from '@/redux/chat.slice';

const Messages = ({ selectedUser, isSidebarOpen, setIsSidebarOpen }) => {
    useGetAllMessages();
    useGetRTM();
    const dispatch = useDispatch()
    const messageRef = useRef(null);
    const { messages, onlineUsers } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.user);
    const [textMessage, setTextMessage] = useState("");
    const isOnline = onlineUsers.includes(selectedUser._id) || false

    // message sender
    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`${API_URL}/message/send/${selectedUser._id}`, { textMessage }, { withCredentials: true })
            if (res.status == 200) {
                const updatedMessages = Array.isArray(messages) ? [...messages, res.data.newMessage] : [res.data.newMessage];
                dispatch(setMessages(updatedMessages));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    return (
        <div className='w-full h-full flex flex-col bg-white'>
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                    >
                        <FaBars size={22} className="text-gray-700" />
                    </button>

                    <Avatar className='w-12 h-12 rounded-full object-cover border-2 border-blue-300'>
                        <AvatarImage
                            src={selectedUser?.profilePicture}
                            alt={selectedUser?.userName}
                        />
                        <AvatarFallback>{selectedUser?.userName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold text-gray-900 text-base">{selectedUser?.userName}</div>
                        <div className="text-xs flex items-center gap-1">
                            <span className={isOnline ? "text-green-500" : "text-gray-400"}>●</span>
                            <span className={isOnline ? "text-green-500" : "text-gray-400"}>{isOnline ? "Online" : "Offline"}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((msg) => {
                        const date = new Date(msg?.updatedAt);
                        let hours = date.getHours();
                        const minutes = date.getMinutes();
                        const ampm = hours >= 12 ? 'PM' : 'AM';
                        hours = hours % 12;
                        hours = hours ? hours : 12;

                        const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

                        return (
                            <div
                                ref={messageRef}
                                key={msg._id}
                                className={`flex ${msg.senderId === user?._id ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-xs px-4 py-2 rounded-2xl break-words shadow-sm ${msg.senderId === user?._id
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                    }`}>
                                    <div>{msg.message}</div>
                                    <time className={`text-xs block mt-1 ${msg.senderId === user?._id
                                        ? 'text-blue-100'
                                        : 'text-gray-500'
                                        }`}>
                                        {formattedTime}
                                    </time>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                )}
                <div ref={messageRef} />
            </div>
            {/* Typing box */}
            <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 bg-white">
                <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Type a message..."
                    value={textMessage}
                    onChange={(e) => setTextMessage(e.target.value)}
                />
                <Button
                    onClick={sendMessageHandler}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
                >
                    Send
                </Button>
            </div>
        </div>
    )
}

export default Messages