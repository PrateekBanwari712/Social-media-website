import { setMessages, addMessage } from "../redux/chat.slice.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      // Add the new message without clearing existing messages
      dispatch(addMessage(newMessage));
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup listener properly
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch]);
};

export default useGetRTM;


