import { useEffect } from "react"
import axios from 'axios'
import { API_URL } from '../utilities/constant.js'
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../redux/chat.slice"


const useGetAllMessages = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.user)
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const response = await axios.get(`${API_URL}/message/all/${selectedUser?._id}`, { withCredentials: true });
                if (response.statusText === 'OK') {
                    dispatch(setMessages(response.data.messages || []));
                }

            } catch (error) {
                console.log(error)
            }
        }
        if (selectedUser?._id) {
            fetchAllMessage();
        }
    }, [selectedUser?._id, dispatch]);

}

export default useGetAllMessages
